'use strict'

contract('DynamicDynMetaConsumer', () => {
  const DDMC = artifacts.require('./DynamicDynMetaConsumer.sol')
  let ddmc

  before(async () => {
    ddmc = await DDMC.new()
  })

  describe('splitting arrays', () => {
    const dynamicResult = '64656361676f6e73756e617573706963696f7573636f7272656374696f6e636f77796f7574736d617274696e67726569737375696e6762726f6f6d6c696b65646164726f636b646976696e6973656861737479686561726b656e656468696e74'
    const drLength = '0000000000000000000000000000000000000000000000000000000000000060'
    const dynamicMeta = 'ebb1ee12c4c189b3ea9cc3c6ef6e0a07772e20518045ba5a1c61c280897e51e71f2cd48ec806af44f509872db983b6d4f59af61ca55534ee155ee5b246af6d37aa'
    const dmLength = '0000000000000000000000000000000000000000000000000000000000000041'
    const concatenated = `${drLength}${dynamicResult}${dmLength}${dynamicMeta}`;
    let tx2, rec2

    context("with data provided by @cag", () => {
      before(async () => {
        tx2 = await ddmc.receiveResult2(`0x${dynamicResult}`, `0x${dynamicMeta}`)
        rec2  = await web3.eth.getTransactionReceipt(tx2.tx)
      })

      it('sending two bytes costs less than 37k', async () => {
        assert.equal(tx2.receipt.gasUsed, 36742)
      })


      it('allocating new memory and copying costs ~2100 gas', async () => {
        const tx1 = await ddmc.receiveResult1A(`0x${concatenated}`)
        const rec1  = await web3.eth.getTransactionReceipt(tx1.tx)

        //Logged data is slightly different, with extra trailing zeros
        // which probably explains the 22 difference in gas... probably a truffle detail.
        assert.equal(rec1.logs[0].data.slice(0, 580), rec2.logs[0].data)

        assert.equal(tx1.receipt.gasUsed, 38815)
      })

      it('moving pointers costs ~1200 gas', async () => {
        const tx1 = await ddmc.receiveResult1B(`0x${concatenated}`)
        const rec1  = await web3.eth.getTransactionReceipt(tx1.tx)

        assert.equal(rec1.logs[0].data.slice(0, 580), rec2.logs[0].data)
        assert.equal(tx1.receipt.gasUsed, 37920)
      })
    })

    context("with data that is twice as long as @cag's", () => {
      const dynamicResultX2 = `${dynamicResult}${dynamicResult}`
      const drLengthX2 = '00000000000000000000000000000000000000000000000000000000000000c0'
      const dynamicMetaX2 = `${dynamicMeta}${dynamicMeta}`
      const dmLengthX2 = '0000000000000000000000000000000000000000000000000000000000000082'
      const concatenatedX2 = `${drLengthX2}${dynamicResultX2}${dmLengthX2}${dynamicMetaX2}`;

      before(async () => {
        tx2 = await ddmc.receiveResult2(`0x${dynamicResultX2}`, `0x${dynamicMetaX2}`)
        rec2  = await web3.eth.getTransactionReceipt(tx2.tx)
      })

      it('sending two bytes costs ~49k', async () => {
        assert.equal(tx2.receipt.gasUsed, 49068)
      })

      it('allocating new memory and copying costs ~3300 gas', async () => {
        const tx1 = await ddmc.receiveResult1A(`0x${concatenatedX2}`)
        const rec1  = await web3.eth.getTransactionReceipt(tx1.tx)

        assert.equal(rec1.logs[0].data.slice(0, 902), rec2.logs[0].data)

        assert.equal(tx1.receipt.gasUsed, 52320)
      })

      it('moving pointers costs ~1500 gas', async () => {
        const tx1 = await ddmc.receiveResult1B(`0x${concatenatedX2}`)
        const rec1  = await web3.eth.getTransactionReceipt(tx1.tx)

        assert.equal(rec1.logs[0].data.slice(0, 902), rec2.logs[0].data)
        assert.equal(tx1.receipt.gasUsed, 50629)
      })
    })
  })
})
