pragma solidity ^0.4.24;

contract GasABI {

  event LogBytes(bytes a, bytes b);

  function singleArray(bytes a) public {
    bytes memory b;
    bytes memory c;
    assembly {
      b := add(a, 0x60)
      c := add(a, add(mload(add(a, 0x40)), 0x20))
    }
    emit LogBytes(b, c);
  }

  function doubleArray(bytes b, bytes c) public {
    emit LogBytes(b, c);
  }

  function emptySingle(bytes a) public {}

  function emptyDouble(bytes a, bytes b) public {}

}
