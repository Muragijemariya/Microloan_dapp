// // // src/Lender.js

// // import React, { useEffect, useState } from "react";
// // import { ethers } from "ethers";
// // import contractData from "./contractData.json";
// // import "./App.css";

// // function Lender() {
// //   const [walletConnected, setWalletConnected] = useState(false);
// //   const [contract, setContract] = useState(null);
// //   const [loanId, setLoanId] = useState("");
// //   const [requestedLoans, setRequestedLoans] = useState([]);
// //   const [selectedLoan, setSelectedLoan] = useState(null);
// //   const [isOverdue, setIsOverdue] = useState(false);

// //   // 1️⃣ Connect wallet & load contract
// //   const connectWallet = async () => {
// //     if (!window.ethereum) return alert("Install MetaMask first.");
// //     const provider = new ethers.BrowserProvider(window.ethereum);
// //     await provider.send("eth_requestAccounts", []);
// //     const signer = await provider.getSigner();
// //     const ctr = new ethers.Contract(
// //       contractData.address,
// //       contractData.abi,
// //       signer
// //     );
// //     setContract(ctr);
// //     setWalletConnected(true);
// //   };

// //   // 2️⃣ Load list of unfunded loan IDs
// //   const loadUnfundedLoans = async () => {
// //     if (!contract) return;
// //     const count = await contract.loanCounter();
// //     const ids = [];
// //     for (let i = 1; i <= Number(count); i++) {
// //       const loan = await contract.loans(i);
// //       if (!loan.isFunded) ids.push(i);
// //     }
// //     setRequestedLoans(ids);
// //   };

// //   // 3️⃣ Fetch details for a specific loan
// //   const fetchLoanDetails = async () => {
// //     if (!contract || loanId === "") return;
// //     try {
// //       const idBn = ethers.toBigInt(loanId);
// //       const loan = await contract.loans(idBn);
// //       const overdue = await contract.isLoanOverdue(idBn);
// //       setSelectedLoan(loan);
// //       setIsOverdue(overdue);
// //     } catch (err) {
// //       alert("Invalid loan ID");
// //       console.error(err);
// //     }
// //   };

// //   // 4️⃣ Fund the selected loan
// //   const fundLoan = async () => {
// //     if (!contract || !selectedLoan) return;
// //     try {
// //       const idBn = ethers.toBigInt(loanId);
// //       const tx = await contract.fundLoan(idBn, {
// //         value: selectedLoan.amount,
// //       });
// //       await tx.wait();
// //       alert("Loan funded successfully!");
// //       setLoanId("");
// //       setSelectedLoan(null);
// //       loadUnfundedLoans(); // refresh list
// //     } catch (err) {
// //       alert("Error funding loan");
// //       console.error(err);
// //     }
// //   };

// //   // On mount, connect wallet
// //   useEffect(() => {
// //     connectWallet();
// //   }, []);

// //   // When contract loads, fetch the loan list
// //   useEffect(() => {
// //     if (contract) loadUnfundedLoans();
// //   }, [contract]);

// //   return (
// //     <div className="container">
// //       {/* Back to Main Dashboard */}
// //       <button
// //         className="back-button"
// //         onClick={() => (window.location.href = "/")}
// //       >
// //         ⬅ Back to Dashboard
// //       </button>

// //       <h1>Lender Dashboard</h1>

// //       {walletConnected ? (
// //         <>
// //           {/* Unfunded Loan IDs */}
// //           <div className="card">
// //             <h3>Requested Loan IDs</h3>
// //             {requestedLoans.length > 0 ? (
// //               <ul>
// //                 {requestedLoans.map((id) => (
// //                   <li key={id}>Loan ID: {id}</li>
// //                 ))}
// //               </ul>
// //             ) : (
// //               <p>No loan requests available.</p>
// //             )}
// //           </div>

// //           {/* Fund by ID */}
// //           <div className="card">
// //             <h3>Fund a Loan by ID</h3>
// //             <input
// //               type="number"
// //               placeholder="Enter Loan ID"
// //               value={loanId}
// //               onChange={(e) => setLoanId(e.target.value)}
// //             />
// //             <button onClick={fetchLoanDetails}>View Loan</button>

// //             {selectedLoan && (
// //               <div className="loan-details">
// //                 <p>
// //                   <strong>Borrower:</strong> {selectedLoan.borrower}
// //                 </p>
// //                 <p>
// //                   <strong>Amount:</strong>{" "}
// //                   {ethers.formatEther(selectedLoan.amount)} ETH
// //                 </p>
// //                 <p>
// //                   <strong>Interest Rate:</strong>{" "}
// //                   {selectedLoan.interestRate.toString()}%
// //                 </p>
// //                 <p>
// //                   <strong>Repayment Period:</strong>{" "}
// //                   {Number((selectedLoan.repaymentPeriod) / 2592000n )} Months
// //                 </p>
// //                 <p>
// //                   <strong>Overdue:</strong> {isOverdue ? "Yes ❌" : "No ✅"}
// //                 </p>
// //                 <button onClick={fundLoan}>Fund Loan</button>
// //               </div>
// //             )}
// //           </div>
// //         </>
// //       ) : (
// //         <button onClick={connectWallet}>Connect Wallet</button>
// //       )}
// //     </div>
// //   );
// // }

// // export default Lender;






// import React, { useState, useEffect } from "react";
// import { ethers, formatEther } from "ethers";
// import Microloan from "./contracts/Microloan.json";

// const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// function Lender() {
//   const [provider, setProvider] = useState(null);
//   const [signer, setSigner] = useState(null);
//   const [contract, setContract] = useState(null);
//   const [account, setAccount] = useState("");
//   const [loanId, setLoanId] = useState("");
//   const [fundAmount, setFundAmount] = useState("");
//   const [loanData, setLoanData] = useState(null);
//   const [deployerAddress, setDeployerAddress] = useState("");
//   const [depositAmount, setDepositAmount] = useState("");
  

//   useEffect(() => {
//     const init = async () => {
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       const signer = await provider.getSigner();
//       const accounts = await provider.send("eth_requestAccounts", []);
//       const contract = new ethers.Contract(CONTRACT_ADDRESS, Microloan.abi, signer);

//       const deployer = await contract.owner();

//       if (accounts[0].toLowerCase() !== deployer.toLowerCase()) {
//         alert("You are not the lender (contract deployer). Please use the Borrower dashboard.");
//       }

//       setProvider(provider);
//       setSigner(signer);
//       setContract(contract);
//       setAccount(accounts[0]);
//       setDeployerAddress(deployer);
//     };
//     init();
//   }, []);


//   // const depositToContract = async () => {
//   //   try {
//   //     if (!depositAmount || isNaN(depositAmount)) {
//   //       alert("Enter a valid deposit amount.");
//   //       return;
//   //     }

//   //     const tx = await signer.sendTransaction({
//   //       to: CONTRACT_ADDRESS,
//   //       value: ethers.parseEther(depositAmount),
//   //     });

//   //     await tx.wait();
//   //     alert("Funds deposited to contract!");
//   //   } catch (error) {
//   //     console.error("Error depositing:", error);
//   //     alert("Error depositing funds.");
//   //   }
//   // };

//   const depositToContract = async () => {
//     try {
//         const provider = new ethers.BrowserProvider(window.ethereum);
//         const signer = await provider.getSigner();
//         const contract = new ethers.Contract(CONTRACT_ADDRESS, Microloan.abi, signer);

//         const tx = await contract.deposit({ value: ethers.parseEther(depositAmount) }); // deposit 1 ETH
//         await tx.wait();
//         console.log("Deposit successful");
//     } catch (err) {
//         console.error("Deposit failed:", err);
//     }
//   };


//   const fundLoan = async () => {
//     const tx = await contract.fundLoan(loanId);
//     await tx.wait();
//     alert("Loan funded successfully.");
//   };

//   const fetchLoan = async () => {
//     try {
//       const loan = await contract.loans(loanId);
//       const isOverdue = await contract.isLoanOverdue(loanId);
  
//       setLoanData({
//         amount: loan.amount,
//         funded: loan.isFunded,
//         repaid: loan.isRepaid,
//         isLoanOverdue: isOverdue,
//       });
//     } catch (err) {
//       console.error("Error fetching loan:", err);
//       setLoanData(null);
//     }
//   };
  

//   return (
//     <div>
//       <h2>Lender Dashboard</h2>
//       <p>Connected as: {account}</p>
//       <p>Deployer (Lender): {deployerAddress}</p>



//       <div>
//         <label>Deposit ETH to Contract:</label>
//         <input
//           type="number"
//           value={depositAmount}
//           onChange={(e) => setDepositAmount(e.target.value)}
//         />
//         <button onClick={depositToContract} style={{ marginLeft: "1rem" }}>
//           Deposit Funds
//         </button>
//       </div>



//       <div>
//         <h3>Fund Loan</h3>
//         <input
//           type="text"
//           placeholder="Loan ID"
//           onChange={(e) => setLoanId(e.target.value)}
//         />
//         <button onClick={fundLoan}>Fund</button>
//       </div>

//       <div>
//         <h3>Fetch Loan</h3>
//         <input
//           type="text"
//           placeholder="Loan ID"
//           onChange={(e) => setLoanId(e.target.value)}
//         />
//         <button onClick={fetchLoan}>Fetch</button>
//       </div>

//       {loanData && (
//         <div>
//         <p>
//           Amount:{" "}
//           {loanData?.amount
//             ? ethers.formatEther(loanData.amount)
//             : "N/A"}{" "}
//           ETH
//         </p>
//         <p>Funded: {loanData?.funded?.toString() ?? "N/A"}</p>
//         <p>Repaid: {loanData?.repaid?.toString() ?? "N/A"}</p>
//         <p>Overdue: {loanData?.isLoanOverdue === true ? "Yes" : loanData?.isLoanOverdue === false ? "No" : "N/A"}</p>
//       </div>
      
//       )}
//     </div>
//   );
// }

// export default Lender;


import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Microloan from "./contracts/Microloan.json";
import { Container, Card, Button, Form, Row, Col, Alert, Badge, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./borrower&lender.css"; // Optional custom CSS

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function Lender({ onBack }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [loanId, setLoanId] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [loanData, setLoanData] = useState(null);
  const [deployerAddress, setDeployerAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const accounts = await provider.send("eth_requestAccounts", []);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, Microloan.abi, signer);
        const deployer = await contract.owner();

        if (accounts[0].toLowerCase() !== deployer.toLowerCase()) {
          setError("You are not the lender (contract deployer). Please use the Borrower dashboard.");
        }

        setProvider(provider);
        setSigner(signer);
        setContract(contract);
        setAccount(accounts[0]);
        setDeployerAddress(deployer);
      } catch (err) {
        setError("Failed to connect: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const depositToContract = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (!depositAmount || isNaN(depositAmount) || Number(depositAmount) <= 0) {
        throw new Error("Please enter a valid deposit amount");
      }

      const tx = await contract.deposit({ value: ethers.parseEther(depositAmount) });
      await tx.wait();
      setSuccess(`${depositAmount} ETH deposited successfully!`);
      setDepositAmount("");
    } catch (err) {
      setError("Deposit failed: " + (err.reason || err.message));
    } finally {
      setLoading(false);
    }
  };

  const fundLoan = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (!loanId) {
        throw new Error("Please enter a loan ID");
      }

      const tx = await contract.fundLoan(loanId);
      await tx.wait();
      setSuccess(`Loan ${loanId} funded successfully!`);
      setLoanId("");
      setLoanData(null);
    } catch (err) {
      setError("Funding failed: " + (err.reason || err.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchLoan = async () => {
    try {
      setLoading(true);
      setError(null);
      setLoanData(null);

      if (!loanId) {
        throw new Error("Please enter a loan ID");
      }

      const loan = await contract.loans(loanId);
      const isOverdue = await contract.isLoanOverdue(loanId);

      setLoanData({
        amount: loan.amount,
        borrower: loan.borrower,
        funded: loan.isFunded,
        repaid: loan.isRepaid,
        interestRate: loan.interestRate,
        repaymentPeriod: loan.repaymentPeriod,
        isLoanOverdue: isOverdue,
      });
    } catch (err) {
      setError("Error fetching loan: " + (err.reason || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="lender-dashboard py-4">
      <Button variant="outline-secondary" onClick={onBack} className="mb-4">
        &larr; Back to Dashboard
      </Button>

      <Card className="mb-4">
        <Card.Header>
          <h2 className="mb-0">Lender Dashboard</h2>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Card.Text>
                <strong>Connected Wallet:</strong> {account}
              </Card.Text>
            </Col>
            <Col md={6}>
              <Card.Text>
                <strong>Contract Owner:</strong> {deployerAddress}
              </Card.Text>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>Deposit Funds to Contract</Card.Header>
            <Card.Body>
              <Form.Group controlId="depositAmount">
                <Form.Label>Amount (ETH)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Enter ETH amount"
                />
              </Form.Group>
              <Button
                variant="primary"
                onClick={depositToContract}
                disabled={loading || !depositAmount}
                className="mt-3"
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Deposit Funds"}
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>Loan Operations</Card.Header>
            <Card.Body>
              <Form.Group controlId="loanId">
                <Form.Label>Loan ID</Form.Label>
                <Form.Control
                  type="text"
                  value={loanId}
                  onChange={(e) => setLoanId(e.target.value)}
                  placeholder="Enter loan ID"
                />
              </Form.Group>

              <div className="d-flex gap-2 mt-3">
                <Button
                  variant="info"
                  onClick={fetchLoan}
                  disabled={loading || !loanId}
                >
                  {loading ? <Spinner animation="border" size="sm" /> : "View Loan"}
                </Button>
                <Button
                  variant="success"
                  onClick={fundLoan}
                  disabled={loading || !loanId}
                >
                  {loading ? <Spinner animation="border" size="sm" /> : "Fund Loan"}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {loanData && (
        <Card className="mb-4">
          <Card.Header>Loan Details</Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <p><strong>Borrower:</strong> {loanData.borrower}</p>
                <p><strong>Amount:</strong> {ethers.formatEther(loanData.amount)} ETH</p>
                <p><strong>Interest Rate:</strong> {loanData.interestRate.toString()}%</p>
              </Col>
              <Col md={6}>
                <p>
                  <strong>Status:</strong>{" "}
                  {loanData.repaid ? (
                    <Badge bg="success">Repaid</Badge>
                  ) : loanData.funded ? (
                    <Badge bg="warning">Funded</Badge>
                  ) : (
                    <Badge bg="secondary">Requested</Badge>
                  )}
                </p>
                <p>
                  <strong>Overdue:</strong>{" "}
                  {loanData.isLoanOverdue ? (
                    <Badge bg="danger">Yes</Badge>
                  ) : (
                    <Badge bg="success">No</Badge>
                  )}
                </p>
                <p>
                  <strong>Repayment Period:</strong>{" "}
                  {Number(loanData.repaymentPeriod / 2592000n)} months
                </p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default Lender;