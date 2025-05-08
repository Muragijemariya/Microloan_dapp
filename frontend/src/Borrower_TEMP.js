// import "./borrower&lender.css";
// import React, { useEffect, useState } from "react";
// import { ethers } from "ethers";
// import contractData from "./contractData.json";

// export default function Borrower() {
//   const [walletConnected, setWalletConnected] = useState(false);
//   const [contract, setContract] = useState(null);

//   // Request form state
//   const [loanAmount, setLoanAmount] = useState("");
//   const [interestRate, setInterestRate] = useState("");
//   const [repaymentPeriod, setRepaymentPeriod] = useState("");

//   // Details state
//   const [loanId, setLoanId] = useState("");
//   const [loanDetails, setLoanDetails] = useState(null);
//   const [isOverdue, setIsOverdue] = useState(null);

//   // Connect wallet & contract
//   const connectWallet = async () => {
//     try {
//       if (!window.ethereum) throw new Error("MetaMask not installed");
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       await provider.send("eth_requestAccounts", []);
//       const signer = await provider.getSigner();
//       const ctr = new ethers.Contract(
//         contractData.address,
//         contractData.abi,
//         signer
//       );
//       setContract(ctr);
//       setWalletConnected(true);
//       console.log("✅ Contract loaded:", ctr.address);
//     } catch (err) {
//       console.error("connectWallet error:", err);
//       alert("Failed to connect wallet:\n" + err.message);
//     }
//   };

//   useEffect(() => {
//     connectWallet();
//   }, []);

//   if (!walletConnected) {
//     return (
//       <div style={{ textAlign: "center", marginTop: "2rem" }}>
//         <button onClick={connectWallet}>Connect Wallet</button>
//       </div>
//     );
//   }

//   // Request a new loan
//   const requestLoan = async () => {
//     if (!loanAmount || !interestRate || !repaymentPeriod) {
//       return alert("Please fill out all fields");
//     }
//     try {
//       const amountWei = ethers.parseEther(loanAmount);
//       const rateBn = ethers.toBigInt(interestRate);
//       const periodBn = ethers.toBigInt(repaymentPeriod);

//       console.log("requestLoan:", amountWei, rateBn, periodBn);
//       const tx = await contract.requestLoan(amountWei, rateBn, periodBn);
//       await tx.wait();
//       alert("✅ Loan requested!");
//     } catch (err) {
//       console.error("requestLoan error:", err);
//       alert("Error requesting loan:\n" + (err.reason || err.message));
//     }
//   };

//   // Fetch loan details & overdue status
//   const fetchLoan = async () => {
//     if (!loanId) return alert("Enter a Loan ID");
//     try {
//       const idBn = ethers.toBigInt(loanId);
//       const loan = await contract.loans(idBn);
//       const overdue = await contract.isLoanOverdue(idBn);

//       setLoanDetails(loan);
//       setIsOverdue(overdue);
//     } catch (err) {
//       console.error("fetchLoan error:", err);
//       alert("Error fetching loan:\n" + err.message);
//     }
//   };

//   return (
//     <div className="borrower-section">
//       <button onClick={() => window.location.href = "/"} className="back-button">
//         ⬅ Back to Dashboard
//       </button>

//       <h2>Borrower Dashboard</h2>

//       {/* Request Loan Form */}
//       <div className="form-container">
//         <input
//           type="number"
//           placeholder="Amount (ETH)"
//           value={loanAmount}
//           onChange={(e) => setLoanAmount(e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Interest Rate (%)"
//           value={interestRate}
//           onChange={(e) => setInterestRate(e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Repayment Period (Months)"
//           value={repaymentPeriod}
//           onChange={(e) => setRepaymentPeriod(e.target.value)}
//         />
//         <button onClick={requestLoan}>Request Loan</button>
//       </div>

//       <hr />

//       {/* Fetch Loan Details */}
//       <div className="form-container">
//         <input
//           type="number"
//           placeholder="Loan ID"
//           value={loanId}
//           onChange={(e) => setLoanId(e.target.value)}
//         />
//         <button onClick={fetchLoan}>Get Loan Details</button>
//       </div>

//       {/* Display Details */}
//       {loanDetails && (
//         <div className="alert">
//           <pre>
//             Amount: {ethers.formatEther(loanDetails.amount)} ETH{"\n"}
//             Interest Rate: {loanDetails.interestRate.toString()}%{"\n"}
//             Repayment Period: {(loanDetails.repaymentPeriod / 2592000n).toString()} Months{"\n"}
//             Borrower: {loanDetails.borrower}{"\n"}
//             Lender: {loanDetails.lender}{"\n"}
//             Funded: {loanDetails.isFunded.toString()}{"\n"}
//             Repaid: {loanDetails.isRepaid.toString()}{"\n"}
//             Overdue: {isOverdue ? "Yes" : "No"}
//           </pre>
//         </div>
//       )}
//     </div>
//   );
// }





// import React, { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import Microloan from "./contracts/Microloan.json";

// const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// function Borrower_TEMP() {
//   const [provider, setProvider] = useState(null);
//   const [signer, setSigner] = useState(null);
//   const [contract, setContract] = useState(null);
//   const [account, setAccount] = useState(null);
//   const [loanAmount, setLoanAmount] = useState("");
//   const [interestRate, setInterestRate] = useState("");
//   const [repaymentPeriod, setRepaymentPeriod] = useState("");
//   const [repayLoanId, setRepayLoanId] = useState("");
//   const [repaymentAmount, setRepaymentAmount] = useState("");


//   useEffect(() => {
//     const init = async () => {
//       if (window.ethereum) {
//         const newProvider = new ethers.BrowserProvider(window.ethereum);
//         await window.ethereum.request({ method: "eth_requestAccounts" });
//         const newSigner = await newProvider.getSigner();
//         const newContract = new ethers.Contract(
//           CONTRACT_ADDRESS,
//           Microloan.abi,
//           newSigner
//         );

//         setProvider(newProvider);
//         setSigner(newSigner);
//         setContract(newContract);

//         const userAddress = await newSigner.getAddress();
//         setAccount(userAddress);
//       } else {
//         alert("Please install MetaMask!");
//       }
//     };

//     init();
//   }, []);

//   const requestLoan = async () => {
//     try {
//       if (!contract || !loanAmount || !interestRate || !repaymentPeriod) {
//         alert("Please fill in all loan details.");
//         return;
//       }

//       const tx = await contract.requestLoan(
//         ethers.parseEther(loanAmount),          // convert ETH to Wei
//         parseInt(interestRate),                 // percent as integer
//         parseInt(repaymentPeriod) * 86400       // days to seconds
//       );

//       await tx.wait();
//       alert("Loan requested successfully!");
//     } catch (error) {
//       console.error("Loan request error:", error);
//       alert("Error requesting loan.");
//     }
//   };

//   const repayLoan = async () => {
//     try {
//       if (!repayLoanId || !repaymentAmount) {
//         alert("Enter loan ID and repayment amount");
//         return;
//       }
  
//       const tx = await contract.repayLoan(repayLoanId, {
//         value: ethers.parseEther(repaymentAmount),
//       });
  
//       await tx.wait();
//       alert("Loan repaid successfully!");
//     } catch (err) {
//       console.error("Error repaying loan:", err);
//       alert("Repayment failed. See console for details.");
//     }
//   };
  

//   return (
//     <div style={{ padding: "2rem" }}>
//       <h2>Borrower Dashboard</h2>
//       <p>Account: {account}</p>

//       <div>
//         <label>Loan Amount (ETH):</label>
//         <input
//           type="number"
//           value={loanAmount}
//           onChange={(e) => setLoanAmount(e.target.value)}
//         />
//       </div>

//       <div>
//         <label>Interest Rate (%):</label>
//         <input
//           type="number"
//           value={interestRate}
//           onChange={(e) => setInterestRate(e.target.value)}
//         />
//       </div>

//       <div>
//         <label>Repayment Period (days):</label>
//         <input
//           type="number"
//           value={repaymentPeriod}
//           onChange={(e) => setRepaymentPeriod(e.target.value)}
//         />
//       </div>

//       <button onClick={requestLoan} style={{ marginTop: "1rem" }}>
//         Request Loan
//       </button>

//       <div>
//         <h3>Repay Loan</h3>
//         <input
//           type="text"
//           placeholder="Loan ID"
//           value={repayLoanId}
//           onChange={(e) => setRepayLoanId(e.target.value)}
//         />
//         <input
//           type="text"
//           placeholder="Repayment Amount in ETH"
//           value={repaymentAmount}
//           onChange={(e) => setRepaymentAmount(e.target.value)}
//         />
//         <button onClick={repayLoan}>Repay</button>
//       </div>

//     </div>


//   );
// }

// export default Borrower_TEMP;


import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Microloan from "./contracts/Microloan.json";
import { Container, Card, Button, Form, Alert, Spinner, Row, Col, Badge } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./borrower&lender.css"; // Optional custom CSS

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function Borrower_TEMP({ onBack }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [repaymentPeriod, setRepaymentPeriod] = useState("");
  const [repayLoanId, setRepayLoanId] = useState("");
  const [repaymentAmount, setRepaymentAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        if (!window.ethereum) {
          throw new Error("Please install MetaMask!");
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(CONTRACT_ADDRESS, Microloan.abi, signer);
        const address = await signer.getAddress();

        setProvider(provider);
        setSigner(signer);
        setContract(contract);
        setAccount(address);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const requestLoan = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (!loanAmount || !interestRate || !repaymentPeriod) {
        throw new Error("Please fill all loan details");
      }

      const tx = await contract.requestLoan(
        ethers.parseEther(loanAmount),
        parseInt(interestRate),
        parseInt(repaymentPeriod) * 86400
      );

      await tx.wait();
      setSuccess("Loan requested successfully!");
      setLoanAmount("");
      setInterestRate("");
      setRepaymentPeriod("");
    } catch (err) {
      setError(err.reason || err.message);
    } finally {
      setLoading(false);
    }
  };

  const repayLoan = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (!repayLoanId || !repaymentAmount) {
        throw new Error("Please enter loan ID and repayment amount");
      }

      const tx = await contract.repayLoan(repayLoanId, {
        value: ethers.parseEther(repaymentAmount),
      });

      await tx.wait();
      setSuccess(`Loan ${repayLoanId} repaid successfully!`);
      setRepayLoanId("");
      setRepaymentAmount("");
    } catch (err) {
      setError(err.reason || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="borrower-dashboard py-4">
      <Button variant="outline-secondary" onClick={onBack} className="mb-4">
        &larr; Back to Dashboard
      </Button>

      <Card className="mb-4">
        <Card.Header>
          <h2 className="mb-0">Borrower Dashboard</h2>
        </Card.Header>
        <Card.Body>
          <Card.Text>
            <strong>Connected Wallet:</strong> {account}
          </Card.Text>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess(null)} dismissible>{success}</Alert>}

      <Row>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>Request New Loan</Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Loan Amount (ETH)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="Enter amount in ETH"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Interest Rate (%)</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  max="100"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="Enter interest rate"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Repayment Period (days)</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={repaymentPeriod}
                  onChange={(e) => setRepaymentPeriod(e.target.value)}
                  placeholder="Enter repayment period"
                />
              </Form.Group>

              <Button
                variant="primary"
                onClick={requestLoan}
                disabled={loading || !loanAmount || !interestRate || !repaymentPeriod}
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Request Loan"}
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card>
            <Card.Header>Repay Existing Loan</Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Loan ID</Form.Label>
                <Form.Control
                  type="text"
                  value={repayLoanId}
                  onChange={(e) => setRepayLoanId(e.target.value)}
                  placeholder="Enter loan ID"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Repayment Amount (ETH)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0"
                  value={repaymentAmount}
                  onChange={(e) => setRepaymentAmount(e.target.value)}
                  placeholder="Enter repayment amount"
                />
              </Form.Group>

              <Button
                variant="success"
                onClick={repayLoan}
                disabled={loading || !repayLoanId || !repaymentAmount}
              >
                {loading ? <Spinner animation="border" size="sm" /> : "Repay Loan"}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Borrower_TEMP;