// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Microloan {
    address public owner;

    struct Loan {
        uint256 amount;
        uint256 interestRate;
        uint256 repaymentPeriod;
        uint256 createdAt;
        address payable borrower;
        address payable lender;
        bool isRepaid;
        bool isFunded;
    }

    mapping(uint256 => Loan) public loans;
    mapping(address => uint256) public balances;
    uint256 public loanCounter;

    event LoanRequested(uint256 loanId, address borrower, uint256 amount, uint256 interestRate, uint256 repaymentPeriod);
    event LoanFunded(uint256 loanId, address lender);
    event LoanRepaid(uint256 loanId, address borrower);
    event Deposit(address lender, uint256 amount);
    event Withdraw(address lender, uint256 amount);

    modifier onlyLender() {
        require(msg.sender == owner, "Only the lender (deployer) can perform this action");
        _;
    }

    modifier validLoanId(uint256 _loanId) {
        require(_loanId > 0 && _loanId <= loanCounter, "Invalid loanId");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function deposit() external payable onlyLender {
        require(msg.value > 0, "Deposit must be greater than zero");
        balances[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    event FundsDeposited(address indexed sender, uint256 amount);

    receive() external payable {
        emit FundsDeposited(msg.sender, msg.value);
    }


    function withdraw(uint256 amount) external onlyLender {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Withdrawal failed");
        emit Withdraw(msg.sender, amount);
    }

    function requestLoan(uint256 _amount, uint256 _interestRate, uint256 _repaymentPeriod) external {
        require(msg.sender != owner, "Lender cannot request loans");
        require(_amount > 0 && _repaymentPeriod > 0, "Invalid loan parameters");

        loanCounter++;
        loans[loanCounter] = Loan({
            amount: _amount,
            interestRate: _interestRate,
            repaymentPeriod: _repaymentPeriod,
            createdAt: block.timestamp,
            borrower: payable(msg.sender),
            lender: payable(address(0)),
            isRepaid: false,
            isFunded: false
        });

        emit LoanRequested(loanCounter, msg.sender, _amount, _interestRate, _repaymentPeriod);
    }

    function fundLoan(uint256 _loanId) external onlyLender validLoanId(_loanId) {
        Loan storage loan = loans[_loanId];
        require(!loan.isFunded, "Loan already funded");
        require(loan.amount <= balances[msg.sender], "Insufficient balance to fund");

        balances[msg.sender] -= loan.amount;
        loan.lender = payable(msg.sender);
        loan.isFunded = true;

        (bool success, ) = loan.borrower.call{value: loan.amount}("");
        require(success, "Transfer to borrower failed");

        emit LoanFunded(_loanId, msg.sender);
    }

    function getRepaymentAmount(uint256 _loanId) public view validLoanId(_loanId) returns (uint256) {
        Loan storage loan = loans[_loanId];
        return loan.amount + (loan.amount * loan.interestRate / 100);
    }

    function repayLoan(uint256 _loanId) external payable validLoanId(_loanId) {
        Loan storage loan = loans[_loanId];
        require(loan.isFunded && !loan.isRepaid, "Loan must be funded and unpaid");
        require(msg.sender == loan.borrower, "Only borrower can repay");

        uint256 repaymentAmount = loan.amount + (loan.amount * loan.interestRate / 100);
        require(msg.value == repaymentAmount, "Incorrect repayment amount");

        loan.isRepaid = true;
        balances[loan.lender] += msg.value;

        emit LoanRepaid(_loanId, msg.sender);
    }

    function isLoanOverdue(uint256 _loanId) external view validLoanId(_loanId) returns (bool) {
        Loan storage loan = loans[_loanId];
        if (!loan.isFunded || loan.isRepaid) return false;
        return (block.timestamp > loan.createdAt + loan.repaymentPeriod);
    }

    function getAllLoanRequests() external view returns (
        uint256[] memory loanIds,
        uint256[] memory amounts,
        uint256[] memory interestRates,
        uint256[] memory repaymentPeriods,
        uint256[] memory createdAts,
        address[] memory borrowers,
        bool[] memory isFundeds,
        bool[] memory isRepaids
    ) {
        loanIds = new uint256[](loanCounter);
        amounts = new uint256[](loanCounter);
        interestRates = new uint256[](loanCounter);
        repaymentPeriods = new uint256[](loanCounter);
        createdAts = new uint256[](loanCounter);
        borrowers = new address[](loanCounter);
        isFundeds = new bool[](loanCounter);
        isRepaids = new bool[](loanCounter);

        for (uint256 i = 0; i < loanCounter; i++) {
            Loan storage loan = loans[i + 1];
            loanIds[i] = i + 1;
            amounts[i] = loan.amount;
            interestRates[i] = loan.interestRate;
            repaymentPeriods[i] = loan.repaymentPeriod;
            createdAts[i] = loan.createdAt;
            borrowers[i] = loan.borrower;
            isFundeds[i] = loan.isFunded;
            isRepaids[i] = loan.isRepaid;
        }
    }

    function getMyLoans() external view returns (
        uint256[] memory ids,
        uint256[] memory amounts,
        uint256[] memory interestRates,
        bool[] memory isFundeds,
        bool[] memory isRepaids
    ) {
        uint256 count = 0;
        for (uint256 i = 1; i <= loanCounter; i++) {
            if (loans[i].borrower == msg.sender) {
                count++;
            }
        }

        ids = new uint256[](count);
        amounts = new uint256[](count);
        interestRates = new uint256[](count);
        isFundeds = new bool[](count);
        isRepaids = new bool[](count);

        uint256 index = 0;
        for (uint256 i = 1; i <= loanCounter; i++) {
            if (loans[i].borrower == msg.sender) {
                ids[index] = i;
                amounts[index] = loans[i].amount;
                interestRates[index] = loans[i].interestRate;
                isFundeds[index] = loans[i].isFunded;
                isRepaids[index] = loans[i].isRepaid;
                index++;
            }
        }
    }
}
