contract DynamicDynMetaConsumer {
  event LogStuff(bytes b, bytes m);

  function receiveResult1A(bytes) external {
    uint blen;
    assembly {
      blen := calldataload(0x44)
    }
    bytes memory b = new bytes(blen);
    assembly {
      calldatacopy(add(b, 0x20), 0x64, blen)
    }

    uint mlen;
    assembly {
      mlen := calldataload(add(blen, 0x64))
    }
    bytes memory m = new bytes(mlen);
    assembly {
      calldatacopy(add(m, 0x20), add(blen, 0x84), mlen)
    }
    emit LogStuff(b, m);
  }

  function receiveResult1B(bytes a) public {
    bytes memory b;
    bytes memory c;
    uint256 d;
    assembly {
      b := add(a, 0x20)
      c := add(add(a, 0x40), mload(add(a, 0x20)))
    }
    emit LogStuff(b, c);
  }

  function receiveResult2(bytes b, bytes m) external {
    emit LogStuff(b, m);
  }
}
