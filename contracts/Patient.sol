pragma solidity >=0.4.25;
//pragma experimental ABIEncoderV2;

contract Patient{
	//Multihash structure to store ipfs hash link given below
	//https://ethereum.stackexchange.com/questions/17094/how-to-store-ipfs-hash-using-bytes
	struct Multihash {
  		uint8 hash_function;
  		uint8 size;
  		bytes32 hash;
	}
	struct Prescription{
		uint id;
		Multihash dataHash; 
	}

	mapping(uint => mapping(uint => Prescription)) internal prescriptions;
	// prescriptions[patient id][prescription id] contains IPFS hash

	mapping(uint => uint) public prescriptionsCount;
	//prescriptionsCount[patient_id] contains number of prescription of a given patient

	function addPrescription (uint pat_id,uint8 _hash_function,uint8 _size,bytes32 _hash) public {
		//the stored data 

		//require (approvedDocs[msg.sender]);
		uint prc = prescriptionsCount[pat_id];
		prc++;
		Multihash memory tmpHash;
		tmpHash.hash = _hash;
		tmpHash.hash_function = _hash_function;
		tmpHash.size = _size;
		prescriptions[pat_id][prc] = Prescription(prc,tmpHash);
		prescriptionsCount[pat_id] = prc;

	}

	 function getPrescription(uint pat_id,uint pre_id) public view returns (uint8 a, uint8 b, bytes32 c) {
	     
	    return (prescriptions[pat_id][pre_id].dataHash.hash_function,prescriptions[pat_id][pre_id].dataHash.size, prescriptions[pat_id][pre_id].dataHash.hash);
	 }
	 
	 function getPrescriptionCount (uint pat_id) public view returns(uint res) {
	 	return prescriptionsCount[pat_id];
	 }
	 

}
