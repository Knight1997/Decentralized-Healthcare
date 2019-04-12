pragma solidity 0.5.0;

import "./Patient.sol";

contract TestPatient is Patient{
	function testAddPatient() public{
		uint pat_id = 1;
		uint8 hash_func = 18;
		uint8 size = 32;
		bytes32 hash =  0x7465737400000000000000000000000000000000000000000000000000000000;//need to insert
		uint tmphash_function ;
		uint tmpsize;
		bytes32 tmphash ;
		uint prc_init = getPrescriptionCount (pat_id);//Initial prescription count 
		addPrescription(pat_id,hash_func,size,hash);
		assert(prc_init+1 == getPrescriptionCount(pat_id));
		(tmphash_function,tmpsize,tmphash) = getPrescription(pat_id,prc_init+1); 
		assert(tmphash_function == hash_func);
		assert(tmpsize == size);
		assert(tmphash == hash);

	}
}