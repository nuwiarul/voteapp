import React, { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import axios from 'axios';
import { useRouter } from 'next/router';

// INTERNAL IMPORT 

import { VotingAddress, VotingAddressABI } from './constants';

const projectId = '2Ma7Tm8vutVSnV4EX6dPvIwSYbD';
const projectSecret = '966c8aaa26013ec3a41a680028f5f408';

const infuraAuth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString('base64')}`

const client = ipfsHttpClient({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: infuraAuth
    }
})

//const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')



const fetchContract = (signerOrProvider) => new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider);

export const VotingContext = React.createContext();

export const VotingProvider = ({ children }) => {
    const votingTitle = 'My First smart contract app';
    const router = useRouter();
    const [currentAccount, setCurrentAccount] = useState('');
    const [candidateLength, setCandidateLength] = useState('');
    const pushCandidate = [];
    const candidateIndex = [];
    const [candidateArray, setCandidateArray] = useState(pushCandidate);

    //--------------------END OF CANDIDATE DATA

    const [error, setError] = useState('');
    const higestVote = [];

    //-------------VOTER SECTION
    const pushVoter = [];
    const [voterArray, setVoterArray] = useState(pushVoter);
    const [voterLength, setVoterLength] = useState('');
    const [voterAddress, setVoterAddress] = useState([]);

    //---- CONNECTING WALLET METAMASK

    const checkIfWalletIsConnected = async () => {
        if (!window.ethereum) return setError("Please Install MetaMask");
        const account = await window.ethereum.request({ method: "eth_accounts" });

        if (account.length) {
            setCurrentAccount(account[0])
        } else {
            setError("Please Install MetaMask & Connect, Reload");
        }
    }

    //---- CONNECT WALLET
    const connectWallet = async () => {
        if (!window.ethereum) return setError("Please Install MetaMask");
        const account = await window.ethereum.request({ method: "eth_requestAccounts" });
        setCurrentAccount(account[0])
    }

    //---UPLOAD TO IPFS VOTER IMAGE

    const uploadToIPFS = async (file) => {
        try {
            const added = await client.add({ content: file });
            const url = `https://ipfs.io/ipfs/${added.path}`;
            return url;
        } catch (error) {
            setError("Error Uploading file to IPFS");
        }
    }

    const uploadToIPFSCandidate = async (file) => {
        try {
            const added = await client.add({ content: file });
            const url = `https://ipfs.io/ipfs/${added.path}`;
            return url;
        } catch (error) {
            setError("Error Uploading file to IPFS");
        }
    }

    //----------CREATE VOTER
    const createVoter = async (formInput, fileUrl, router) => {
        try {
            const { name, address, position, } = formInput;
            if (!name || !address || !position) return setError("Input data is missing")

            //CONNECTING SMART CONTRACT SECTION
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect()
            //const provider = new ethers.BrowserProvider(connection); // ether 6
            //const signer = await provider.getSigner()
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer)

            const data = JSON.stringify({ name, address, position, image: fileUrl });
            const added = await client.add(data)
            const url = `https://ipfs.io/ipfs/${added.path}`;

            const voter = await contract.voterRight(address, name, fileUrl, url)
            voter.wait()

            router.push("/voterList")
        } catch (error) {
            console.log(error)
            setError("Error in creatimg voter");
        }
    }

    //-------------------GET VOTER DATA

    const getAllVoterData = async () => {
        try {
            //CONNECTING SMART CONTRACT SECTION
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect()
            //const provider = new ethers.BrowserProvider(connection);
            //const signer = await provider.getSigner()
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer)

            //VOTER LIST
            const voterListData = await contract.getVoterList();
            setVoterAddress(voterListData);
            voterListData.map(async (el) => {
                const singleVoterData = await contract.getVoterData(el)
                pushVoter.push(singleVoterData)
            })

            const voterList = await contract.getVoterLength()
            setVoterLength(voterList.toNumber())
        } catch (error) {
            console.log(error)
            setError("Something went wrong fetching data");
        }

    }


    /* useEffect(() => {
        getAllVoterData()
    }, []) */

    //------GIVE VOTE
    const giveVote = async(id) => {
        try {
            const candidateAddres = id.address;
            const candidateId = id.id;
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect()
            //const provider = new ethers.BrowserProvider(connection);
            //const signer = await provider.getSigner()
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer)

            const voteredList = await contract.vote(candidateAddres, candidateId)
            console.log(voteredList)

        } catch (error) {
            console.log(error)
            setError("Error giving vote");
        }
    }


    //---------------------------CANDIDATE SECTION--------------------

    const setCandidate = async (candidateForm, fileUrl, router) => {
        try {
            const { name, address, age, } = candidateForm;
            if (!name || !address || !age) return setError("Input data is missing")

            //CONNECTING SMART CONTRACT SECTION
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect()
            //const provider = new ethers.BrowserProvider(connection);
            //const signer = await provider.getSigner()
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer)

            const data = JSON.stringify({ name, address, image: fileUrl, age });
            const added = await client.add(data)
            const url = `https://ipfs.io/ipfs/${added.path}`;

            const candidate = await contract.setCandidate(address, age, name, fileUrl, url)
            candidate.wait()

           

            router.push("/")
        } catch (error) {
            console.log(error)
            setError("Error in set candidate");
        }
    }

    //--GET CANDIDATE DATA
    const getNewCandidate = async() => {
        try {
            //CONNECTING SMART CONTRACT SECTION
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect()
            //const provider = new ethers.BrowserProvider(connection);
            //const signer = await provider.getSigner()
            //const provider = new ethers.providers.Web3Provider(connection);
            //const signer = provider.getSigner();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const contract = fetchContract(signer)

            //-----------ALL CANDIDATE
            const allCandidate = await contract.getCandidate()

            allCandidate.map(async(el) => {
                const singleCandidateData = await contract.getCandidateData(el)
                pushCandidate.push(singleCandidateData)
                candidateIndex.push(singleCandidateData[2].toNumber())
            });

            //--------------CANDIDATE LENGTH
            const allCandidateLength = await contract.getCandidateLength()
            setCandidateLength(allCandidateLength.toNumber())
            

        } catch (error) {
            console.log(error)
            setError("Error in get new candidate");
        }
    }

   /*  useEffect(() =>{
        getNewCandidate()
    }, []) */

    return (
        <VotingContext.Provider value={{
            votingTitle,
            checkIfWalletIsConnected,
            connectWallet,
            uploadToIPFS,
            createVoter,
            getAllVoterData,
            giveVote,
            setCandidate,
            getNewCandidate,
            uploadToIPFSCandidate,
            error,
            voterArray,
            voterLength,
            voterAddress,
            currentAccount,
            candidateLength,
            candidateArray
        }}>
            {children}
        </VotingContext.Provider>
    )
}

