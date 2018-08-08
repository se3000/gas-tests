'use strict'

contract('GasABI', () => {
  const GasABI = artifacts.require("./GasABI.sol")
  let gs

  beforeEach(async () => {
    gs = await GasABI.new()
  })

  describe('splitting arrays', () => {
    const encoded = '0x000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000001310000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000013200000000000000000000000000000000000000000000000000000000000000';

    it("costs a small amount more to parse AND log", async () => {
      const tx1 = await gs.singleArray(encoded)
      const tx2 = await gs.doubleArray("0x31", "0x32")
      const rec1  = await web3.eth.getTransactionReceipt(tx1.tx)
      const rec2  = await web3.eth.getTransactionReceipt(tx2.tx)

      assert.equal(rec1.logs[0].data, rec2.logs[0].data)
      assert.equal(tx1.receipt.gasUsed, 26334)
      assert.equal(tx2.receipt.gasUsed, 26040)
    })

    it("costs a small amount more to parse", async () => {
      const tx1 = await gs.emptySingle(encoded)
      const tx2 = await gs.emptyDouble(encoded, "")

      assert.equal(tx1.receipt.gasUsed, 23264)
      assert.equal(tx2.receipt.gasUsed, 23943)
    })
  })
})
