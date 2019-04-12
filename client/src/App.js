import React, { Component } from "react";
//import SimpleStorageContract from "./contracts/SimpleStorage.json";
import PatientContract from "./contracts/Patient.json";
import getWeb3 from "./utils/getWeb3";
import ipfs from './ipfs'
import bs58 from './base58'
import "./App.css";

class App extends Component {
  state = {
   ipfsHash: '',
   storageValue: 0, 
   web3: null, 
   accounts: null, 
   contract: null,
   buffer: null, 
   patient_id: '1',
   prescriptionslist: []
 };

 constructor(props) {
    super(props)

    this.state = {
   ipfsHash: '',
   storageValue: 0, 
   web3: null, 
   accounts: null, 
   contract: null,
   buffer: null, 
   patient_id: '1',
   prescriptionslist: []
 };

    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.show = this.show.bind(this);
}


  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      //const deployedNetwork = SimpleStorageContract.networks[networkId];
      const deployedNetwork = PatientContract.networks[networkId];
      // const instance = new web3.eth.Contract(
      //   SimpleStorageContract.abi,
      //   deployedNetwork && deployedNetwork.address,
      // );

      const instance =  await new web3.eth.Contract(
        PatientContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      console.log('%%%%%%%% ',instance)
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      const contract = require('truffle-contract')
      // const simpleStorage = contract(SimpleStorageContract)
      // simpleStorage.setProvider(web3.currentProvider)
      const patient = contract(PatientContract)
      patient.setProvider(web3.currentProvider)


      this.setState({ web3, accounts, contract: instance }, this.runExample);
      //{ accounts, contract } = this.state;

       // Get accounts.
       //DID IT
       var to_hex_array = []
       var to_byte_map = {};
        for (var ord=0; ord<=0xff; ord++) {
        var s = ord.toString(16);
        if (s.length < 2) {
          s = "0" + s;
        }
        to_hex_array.push(s);
        to_byte_map[s] = ord;
      }
       function hexToBuffer(s) {
        var length2 = s.length;
        console.log(s.length);
        if ((length2 % 2) != 0) {
          throw "hex string must have length a multiple of 2";
        }
        //console.log(length2)
        var length = length2 / 2;
        
        var result = new Uint8Array(length);
        for (var i=0; i<length; i++) {
          var i2 = i * 2;
          var b = s.substring(i2, i2 + 2);
          result[i] = to_byte_map[b];
        }
        return result;
      }
       let a = await web3.eth.getAccounts()
       let f

       // await instance.methods.getPrescription(1,1).call().then((i)=>{
       //     console.log(i)
       //     f=i
       // })
       await instance.methods.getPrescription(1,1).call().then((i)=>{
           console.log(i)
           let iHash = new Uint8Array(34)
           let t = new Uint8Array(2)
           t[0] = i.a 
           t[1] = i.b
           iHash.set(t)
           //iHash.set(i.c,32)
           let temp = hexToBuffer(i.c.toString(16))
           temp = temp.subarray(1,33)
           console.log(temp);
           iHash.set(temp,2)
           console.log("ihash buffer ",iHash)
           const ipHash = bs58.encode(Buffer(iHash))
           console.log("ipfsHash : ", ipHash)
           this.setState({ipfsHash: ipHash})

       })
        //this.setState({ipfsHash: f})
        //console.log(this.state.ipfsHash)
       // await instance.methods.getPrescription(1,1).call().then(function(result){
       // console.log('result: ' + JSON.stringify(result));
       //  })
       //  .catch(function(error) {
       //    console.log('error: ' + error);
       //   });
       
      await web3.eth.getAccounts((error, accounts) => {
         patient.deployed().then((instance) => {
          this.patientInstance = instance
          this.setState({ account: accounts[0] })

      //     console.log("$$ ",accounts[0])
      //     console.log("##",instance)
      //     console.log("@@@@",instance.ipfsHash)
      //     // Get the value from the contract to prove it worked.
      //     const acc = this.simpleStorageInstance.get.call(accounts[0]);
      //     console.log(acc)
          
      //     return this.simpleStorageInstance.get.(accounts[0])call
      //   }).then((ipfsHash) => {

      //     // Update state with the result.
      //     console.log('### ',ipfsHash)
      //     return this.setState({ ipfsHash })
         })
       })  
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error, "@@@@@@@@@@@@@@");
    }

  };

  runExample = async () => {
    const { accounts, contract ,patient_id} = await this.state;

    // Stores a given value, 5 by default.
    //await contract.methods.addPresciption(1,2,3,ehte).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    //const response = await contract.methods.get().call();
    //console.log(response);
    // Update state with the result.
    //this.setState({ storageValue: response });
    //console.log("!!!!!!",this.simpleStorageInstance.ipfsHash)

  };

  handleChange(event) {
      this.setState({patient_id: event.target.value});
  }
   captureFile(event) {
      event.preventDefault()
      console.log(event)
      const file = event.target.files[0]
      const reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
      reader.onloadend = () => {
        this.setState({ buffer: Buffer(reader.result) })
        console.log('buffer', this.state.buffer)
      }
    }

  show(event){
    event.preventDefault()
    console.log(event)
    console.log('^^^^^^')

    var to_hex_array = []
       var to_byte_map = {};
        for (var ord=0; ord<=0xff; ord++) {
        var s = ord.toString(16);
        if (s.length < 2) {
          s = "0" + s;
        }
        to_hex_array.push(s);
        to_byte_map[s] = ord;
      }
       function hexToBuffer(s) {
        var length2 = s.length;
        console.log(s.length);
        if ((length2 % 2) != 0) {
          throw "hex string must have length a multiple of 2";
        }
        //console.log(length2)
        var length = length2 / 2;
        
        var result = new Uint8Array(length);
        for (var i=0; i<length; i++) {
          var i2 = i * 2;
          var b = s.substring(i2, i2 + 2);
          result[i] = to_byte_map[b];
        }
        return result;
      }

    
    const patient_id = this.state.patient_id;
    let tmp =[]
    this.patientInstance.getPrescriptionCount(patient_id).then((prescriptionCount)=>{
      console.log('!@#$%^& ',prescriptionCount);
      console.log("Loop :");
      
      
      for(let j = 1;j<=prescriptionCount;j++){
       // var
       console.log('!0987654 ',prescriptionCount);

          this.patientInstance.getPrescription(patient_id,j).then((i)=>{
             console.log(i)
             let iHash = new Uint8Array(34)
             let t = new Uint8Array(2)
             t[0] = i.a 
             t[1] = i.b
             iHash.set(t)
             //iHash.set(i.c,32)
             let temp = hexToBuffer(i.c.toString(16))
             temp = temp.subarray(1,33)
             console.log(temp);
             iHash.set(temp,2)
             console.log("ihash buffer ",iHash)
             const ipHash = bs58.encode(Buffer(iHash))
             console.log("ipfsHash : ", ipHash)
             //this.setState({ipfsHash: ipHash})
             
             tmp.push(ipHash);
             if(j==prescriptionCount){
                  //let link = "https://ipfs.io/ipfs/" + item
                  const litems = tmp.map((item) => <li><a href = {`https://ipfs.io/ipfs/${item}`} > {item} </a> </li>);//
                 this.setState({prescriptionslist: litems})

                console.log('@@@@!!!@!@!@!@!@!',this.state.prescriptionslist)
             }
             console.log('$$$$$$',tmp)
         })
      }
      
    })

    this.setState({prescriptionslist: tmp})
      console.log(this.state.prescriptionslist)
      console.log('#######@@@!!!!', tmp)

  }

  onSubmit(event) {
    event.preventDefault()
    console.log(event);
    let iHash = null
    ipfs.files.add(this.state.buffer, (error, result) => {
      if(error) {
        console.error(error)
        return
      }
      iHash = result[0].hash
    

      // console.log('result ',result[0].hash)
      // this.simpleStorageInstance.('').then(function (hash) {
      //   console.log(hash);
      // })

      ///pat_id, 3-hash_properties
        //console.log(this.instance);
        const patient_id = this.state.patient_id;
        const temp = bs58.decode(iHash)
        const hash = temp.subarray(2,34)
        const hashfunc = temp.subarray(0,1)
        const size = temp.subarray(1,2)
        console.log('interger ',temp)
        console.log('hash ',hash)
        console.log('size ',size)
        console.log('encode ',bs58.encode(temp))


        this.patientInstance.addPrescription(patient_id, hashfunc, size, hash, {from: this.state.account}).then((r)=>{
          this.setState({ ipfsHash: iHash })
          console.log('ipfsHash ',this.state.ipfsHash);
        });
        // this.instance.set(result[0].hash, { from: this.state.account }).then((r) => {
        // this.setState({ ipfsHash: result[0].hash })
        // console.log('ifpsHash', this.state.ipfsHash)
         //var str = new TextDecoder("utf-8").decode(bs58.decode(this.state.ipfsHash))
        
        //console.log('interger ',str)
      })
    //})
  }
  
    

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">IPFS File Upload DApp</a>
        </nav>
      

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Your Image</h1>
              <p>This Precriptions are stored on IPFS & its IPFS HASH is stored on The Ethereum Blockchain!</p>
              <img src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`} alt=""/>
              <h2>Upload Precription File</h2>
              <form onSubmit={this.onSubmit} >
                <label>Enter Patient ID </label>
                <input type ='text' value={this.state.patient_id} onChange={this.handleChange} />

                <input type='file' onChange={this.captureFile} />
                <input type='submit' />
              </form>
            </div>
          </div>

          <div>
            <br/>
            <button className ="showPres" onClick = {this.show}>Show Prescription</button>
          </div>

          <div>
            <ul> {this.state.prescriptionslist} </ul>
          </div>

        </main>
        
        
        
      </div>
    );
  }
}

export default App;
