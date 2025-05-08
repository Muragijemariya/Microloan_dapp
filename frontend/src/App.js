// // // src/App.js
// // import React, { useState } from "react";
// // import Borrower from "./Borrower_TEMP";
// // import Lender from "./Lender_TEMP";
// // import "./App.css";

// // function App() {
// //   const [role, setRole] = useState("");

// //   const handleRoleSelect = (selectedRole) => {
// //     setRole(selectedRole);
// //   };

// //   const handleBackToMain = () => {
// //     setRole("");
// //   };

// //   return (
// //     <div className="container">
// //       {role === "" && (
// //         <>
// //           <h1>Microloan DApp Dashboard</h1>
// //           <p>Select your role to continue:</p>
// //           <button onClick={() => handleRoleSelect("borrower")}>Borrower</button>
// //           <button onClick={() => handleRoleSelect("lender")}>Lender</button>
// //         </>
// //       )}

// //       {role === "borrower" && <Borrower onBack={handleBackToMain} />}
// //       {role === "lender" && <Lender onBack={handleBackToMain} />}
// //     </div>
// //   );
// // }

// // export default App;



// import React, { useState } from "react";
// import LenderDashboard from "./Lender_TEMP";
// import BorrowerDashboard from "./Borrower_TEMP";
// import "./App.css";

// function App() {
//   const [role, setRole] = useState(null);

//   const handleRoleSelect = (selectedRole) => {
//     setRole(selectedRole);
//   };

//   const handleBack = () => {
//     setRole(null);
//   };

//   return (
//     <div className="App">
//       <h1>Microloan DApp</h1>
//       {!role ? (
//         <div>
//           <p>Select your role:</p>
//           <button onClick={() => handleRoleSelect("lender")}>Lender</button>
//           <button onClick={() => handleRoleSelect("borrower")}>Borrower</button>
//         </div>
//       ) : role === "lender" ? (
//         <LenderDashboard onBack={handleBack} />
//       ) : (
//         <BorrowerDashboard onBack={handleBack} />
//       )}
//     </div>
//   );
// }

// export default App;


import React, { useState } from "react";
import LenderDashboard from "./Lender_TEMP";
import BorrowerDashboard from "./Borrower_TEMP";
import { Container, Button, Card, Row, Col } from "react-bootstrap";
import { FaHandHoldingUsd, FaMoneyBillWave } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [role, setRole] = useState(null);

  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
  };

  const handleBack = () => {
    setRole(null);
  };

  return (
    <Container fluid className="app-container min-vh-100 d-flex flex-column">
      {!role ? (
        <div className="role-selection my-auto">
          <div className="p-5 mb-4 bg-light rounded-3 text-center">
            <div className="container-fluid py-5">
              <h1 className="display-4">Microloan DApp</h1>
              <p className="lead">Connect and transact in the decentralized lending marketplace</p>
            </div>
          </div>
          
          <Row className="justify-content-center">
            <Col md={6}>
              <Card className="role-card shadow">
                <Card.Body className="text-center p-5">
                  <h2 className="mb-4">Select Your Role</h2>
                  <p className="text-muted mb-4">Choose how you want to participate in the microloan ecosystem</p>
                  
                  <div className="d-grid gap-3">
                    <Button 
                      variant="primary" 
                      size="lg" 
                      onClick={() => handleRoleSelect("lender")}
                      className="py-3"
                    >
                      <FaHandHoldingUsd className="me-2" size={20} />
                      I'm a Lender
                      <p className="small mt-2 mb-0">I want to provide funds and earn interest</p>
                    </Button>
                    
                    <Button 
                      variant="success" 
                      size="lg" 
                      onClick={() => handleRoleSelect("borrower")}
                      className="py-3"
                    >
                      <FaMoneyBillWave className="me-2" size={20} />
                      I'm a Borrower
                      <p className="small mt-2 mb-0">I need funding for my project/business</p>
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      ) : role === "lender" ? (
        <LenderDashboard onBack={handleBack} />
      ) : (
        <BorrowerDashboard onBack={handleBack} />
      )}
      
      <footer className="mt-auto py-3 text-center text-muted">
        <small>Microloan DApp @MURAGIJEMARIYA Delphine {new Date().getFullYear()} | Decentralized Finance Platform</small>
      </footer>
    </Container>
  );
}

export default App;