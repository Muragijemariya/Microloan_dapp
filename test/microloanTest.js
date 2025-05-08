const { expect } = require("chai");

describe("Microloan contract", function () {
  let Microloan;
  let microloan;
  let deployer;
  let borrower;
  let lender;

  beforeEach(async function () {
    // ✅ No change needed: Getting signer accounts
    [deployer, borrower, lender] = await ethers.getSigners();

    // ✅ No change needed: Deploying contract
    Microloan = await ethers.getContractFactory("Microloan");
    microloan = await Microloan.deploy();
  });

  it("should request a loan", async function () {
    // ✅ CHANGED for v6: parseEther returns BigInt, which is okay here
    const amount = ethers.parseEther("1"); // returns BigInt
    const interestRate = 5; // number (safe here)
    const repaymentPeriod = 60 * 60 * 24 * 7; // number

    await microloan.connect(borrower).requestLoan(amount, interestRate, repaymentPeriod);

    const loan = await microloan.loans(1);

    // ✅ CHANGED: comparing BigInt → convert to string
    expect(loan.amount.toString()).to.equal(amount.toString());
    expect(loan.interestRate).to.equal(interestRate);
    expect(loan.repaymentPeriod).to.equal(repaymentPeriod);
  });

  it("should fund a loan", async function () {
    const amount = ethers.parseEther("1"); // ✅ OK (BigInt)
    const interestRate = 5;
    const repaymentPeriod = 60 * 60 * 24 * 7;

    await microloan.connect(borrower).requestLoan(amount, interestRate, repaymentPeriod);

    // ✅ OK: passing BigInt value directly in transaction
    await microloan.connect(lender).fundLoan(1, { value: amount });

    const loan = await microloan.loans(1);
    expect(loan.isFunded).to.equal(true);
  });

  it("should repay a loan", async function () {
    const amount = ethers.parseEther("1"); // ✅ OK (BigInt)
    const interestRate = 5n; // ✅ CHANGED to BigInt (important!)
    const repaymentPeriod = 60 * 60 * 24 * 7;

    await microloan.connect(borrower).requestLoan(amount, Number(interestRate), repaymentPeriod);
    await microloan.connect(lender).fundLoan(1, { value: amount });

    // ✅ FIXED: Native BigInt arithmetic (no .add() or .mul())
    const totalRepayment = amount + (amount * interestRate / 100n);

    await microloan.connect(borrower).repayLoan(1, { value: totalRepayment });

    const loan = await microloan.loans(1);
    expect(loan.isRepaid).to.equal(true);
  });

  it("should detect overdue loan", async function () {
    const amount = ethers.parseEther("1");
    const interestRate = 5n; // ✅ CHANGED to BigInt
    const repaymentPeriod = 60 * 60 * 24 * 7;

    await microloan.connect(borrower).requestLoan(amount, Number(interestRate), repaymentPeriod);
    await microloan.connect(lender).fundLoan(1, { value: amount });

    // ✅ Time manipulation for Hardhat
    await network.provider.send("evm_increaseTime", [60 * 60 * 24 * 8]); // +8 days
    await network.provider.send("evm_mine"); // Force next block

    const overdue = await microloan.isLoanOverdue(1);
    expect(overdue).to.equal(true);
  });
});
