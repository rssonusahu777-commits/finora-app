import { Lesson } from './types';

export const EXPENSE_CATEGORIES = [
  'Housing',
  'Transportation',
  'Food',
  'Utilities',
  'Insurance',
  'Healthcare',
  'Savings',
  'Personal',
  'Entertainment',
  'Miscellaneous'
];

export const INCOME_SOURCES = [
  'Salary',
  'Freelance',
  'Investments',
  'Gift',
  'Rental',
  'Other'
];

export const EDUCATIONAL_CONTENT: Lesson[] = [
  {
    id: 'l1',
    title: 'The 50/30/20 Rule',
    category: 'Budgeting',
    durationMinutes: 5,
    content: [
      "The 50/30/20 rule is one of the most popular and simple budgeting methods. It suggests dividing your monthly after-tax income into three distinct categories: Needs, Wants, and Savings.",
      "50% for Needs: This includes essential expenses that you cannot live without, such as rent or mortgage payments, groceries, utilities, health insurance, and minimum debt payments. If these expenses exceed 50% of your income, you may need to downsize your lifestyle or increase your income.",
      "30% for Wants: These are non-essential expenses that enhance your lifestyle. Examples include dining out, entertainment, subscriptions, travel, and shopping for non-essential items. This category allows you to enjoy your money without guilt, provided you stay within the limit.",
      "20% for Savings & Debt Repayment: This crucial portion goes towards your future. It includes contributions to retirement accounts, building an emergency fund, and paying off high-interest debt beyond the minimum payments.",
      "By strictly following this framework, you ensure a balanced financial life where bills are paid, fun is had, and your future is secured."
    ],
    summary: "A simple budgeting framework allocating 50% to needs, 30% to wants, and 20% to savings.",
    keyTakeaways: [
      "Needs are essential for survival.",
      "Wants are for lifestyle enhancements.",
      "Savings ensure future financial stability."
    ],
    questions: [
      {
        id: 'q1',
        question: 'What percentage of income should go to "Wants"?',
        options: ['50%', '20%', '30%', '10%'],
        correctAnswer: 2
      },
      {
        id: 'q2',
        question: 'Which category does "Rent" fall into?',
        options: ['Wants', 'Savings', 'Needs', 'Investments'],
        correctAnswer: 2
      },
      {
        id: 'q3',
        question: 'What is the primary goal of the 20% category?',
        options: ['Buying luxury items', 'Building wealth and security', 'Covering daily bills', 'Paying for vacations'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'l2',
    title: 'Understanding Compound Interest',
    category: 'Investing',
    durationMinutes: 7,
    content: [
      "Compound interest is often called the 'eighth wonder of the world'. Unlike simple interest, which is calculated only on the principal amount, compound interest is calculated on the principal plus the accumulated interest from previous periods.",
      "This creates a snowball effect: your money earns interest, and then that interest earns more interest. Over long periods, this can lead to exponential growth of your wealth.",
      "The frequency of compounding matters. Interest can compound annually, semi-annually, quarterly, monthly, or daily. The more frequently it compounds, the faster your money grows.",
      "Time is the most significant factor in compounding. Starting to invest early, even with small amounts, is often more beneficial than starting late with large amounts. This is why financial advisors emphasize starting as young as possible.",
      "The Rule of 72 is a quick way to estimate doubling time. Divide 72 by your annual interest rate to find out how many years it will take for your investment to double."
    ],
    summary: "Interest calculated on the initial principal and also on the accumulated interest of previous periods.",
    keyTakeaways: [
      "It allows money to grow exponentially.",
      "Time is the most critical factor.",
      "Start investing early to maximize benefits."
    ],
    questions: [
      {
        id: 'q1',
        question: 'Compound interest is calculated on:',
        options: ['Principal only', 'Principal + Accumulated Interest', 'Interest only', 'None of the above'],
        correctAnswer: 1
      },
      {
        id: 'q2',
        question: 'What creates the "snowball effect"?',
        options: ['Spending money', 'Interest earning interest', 'Fixed interest rates', 'Withdrawing early'],
        correctAnswer: 1
      },
      {
        id: 'q3',
        question: 'According to the Rule of 72, how long to double money at 8% return?',
        options: ['5 years', '9 years', '12 years', '7.2 years'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'l3',
    title: 'Debt Snowball vs. Avalanche',
    category: 'Debt',
    durationMinutes: 6,
    content: [
      "When tackling debt, two primary strategies exist: the Snowball method and the Avalanche method. Both require you to make minimum payments on all debts and throw extra money at one specific debt at a time.",
      "The Debt Snowball method focuses on psychology. You list debts from smallest balance to largest, ignoring interest rates. You pay off the smallest debt first. The quick win gives you motivation (momentum) to tackle the next one.",
      "The Debt Avalanche method focuses on mathematics. You list debts from highest interest rate to lowest. You attack the debt with the highest rate first. This saves you the most money in interest over time and gets you out of debt faster mathematically.",
      "Choosing between them depends on your personality. If you need quick wins to stay motivated, choose Snowball. If you are disciplined and want to save money, choose Avalanche.",
      "Regardless of the method, the key to success is consistency and stopping the accumulation of new debt while paying off the old."
    ],
    summary: "Two strategies for debt repayment: one prioritizes psychology (balance size), the other mathematics (interest rate).",
    keyTakeaways: [
      "Snowball: Smallest balance first (Motivation).",
      "Avalanche: Highest interest first (Math).",
      "Both require minimum payments on all other debts."
    ],
    questions: [
      {
        id: 'q1',
        question: 'Which method prioritizes the highest interest rate?',
        options: ['Snowball', 'Avalanche', 'Waterfall', 'Rollercoaster'],
        correctAnswer: 1
      },
      {
        id: 'q2',
        question: 'The main benefit of the Snowball method is:',
        options: ['Psychological motivation', 'Mathematical efficiency', 'Lower interest paid', 'Tax benefits'],
        correctAnswer: 0
      },
      {
        id: 'q3',
        question: 'In both methods, what do you do with non-target debts?',
        options: ['Stop paying them', 'Pay minimums only', 'Pay half', 'Consolidate them'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'l4',
    title: 'Emergency Fund Planning',
    category: 'Budgeting',
    durationMinutes: 5,
    content: [
      "An emergency fund is a stash of money set aside to cover the financial surprises life throws your way. These events can be stressful and costly, such as a job loss, a medical or dental emergency, or major car repairs.",
      "Financial experts generally recommend saving three to six months' worth of living expenses. This amount ensures that if you lose your primary income, you have enough time to find a new job without falling into debt.",
      "Liquidity is key. This money should be kept in a savings account where it is easily accessible (liquid) but separate from your checking account so you aren't tempted to spend it.",
      "Do not invest your emergency fund in the stock market. The market is volatile, and you might be forced to sell at a loss when you need the cash most.",
      "Building this fund should be a top priority before you start aggressive investing or paying off low-interest debt."
    ],
    summary: "A safety net of 3-6 months of expenses kept in a liquid account for unexpected events.",
    keyTakeaways: [
      "Target 3-6 months of expenses.",
      "Keep it liquid (Savings Account).",
      "Do not invest this money in stocks."
    ],
    questions: [
      {
        id: 'q1',
        question: 'How many months of expenses should you save?',
        options: ['1 month', '3-6 months', '1 year', '2 weeks'],
        correctAnswer: 1
      },
      {
        id: 'q2',
        question: 'Where should an emergency fund be kept?',
        options: ['Stock Market', 'Checking Account', 'High Yield Savings Account', 'Real Estate'],
        correctAnswer: 2
      },
      {
        id: 'q3',
        question: 'What is the primary purpose of this fund?',
        options: ['Vacations', 'Unexpected financial shocks', 'Down payment', 'Retirement'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'l5',
    title: 'Good Debt vs. Bad Debt',
    category: 'Debt',
    durationMinutes: 6,
    content: [
      "Not all debt is created equal. Understanding the difference between good and bad debt is crucial for building net worth.",
      "Good debt is money borrowed to purchase assets that are likely to increase in value or generate income. Common examples include a mortgage (home typically appreciates), student loans (education increases earning potential), or a business loan.",
      "Bad debt is money borrowed to purchase rapidly depreciating assets or for consumption. This typically carries high interest rates. Examples include credit card debt for clothes/dining, payday loans, or auto loans for luxury cars you can't afford.",
      "The general rule: If it puts money in your pocket, it's good debt. If it takes money out of your pocket without future return, it's bad debt.",
      "However, even good debt can become bad if you borrow more than you can afford to repay."
    ],
    summary: "Distinguishing between debt that builds wealth and debt that destroys it.",
    keyTakeaways: [
      "Good debt increases potential wealth (Home, Education).",
      "Bad debt buys depreciating assets (Consumables).",
      "High interest usually signals bad debt."
    ],
    questions: [
      {
        id: 'q1',
        question: 'Which of the following is generally considered "Good Debt"?',
        options: ['Credit Card Debt', 'Payday Loan', 'Mortgage', 'Vacation Loan'],
        correctAnswer: 2
      },
      {
        id: 'q2',
        question: 'Bad debt is usually characterized by:',
        options: ['Tax deductibility', 'High interest rates and depreciation', 'Income generation', 'Appreciation'],
        correctAnswer: 1
      },
      {
        id: 'q3',
        question: 'Can good debt become bad?',
        options: ['No, never', 'Yes, if you over-leverage', 'Only during a recession', 'Only if the bank closes'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'l6',
    title: 'Basics of Mutual Funds',
    category: 'Investing',
    durationMinutes: 8,
    content: [
      "A mutual fund is a company that pools money from many investors and invests the money in securities such as stocks, bonds, and short-term debt. The combined holdings of the mutual fund are known as its portfolio.",
      "Investors buy shares in mutual funds. Each share represents an ownership interest in the fund and the income it generates.",
      "The biggest advantage is diversification. By buying one fund, you instantly own hundreds of stocks or bonds, reducing the risk compared to buying a single stock.",
      "Professional Management: Mutual funds are managed by professional fund managers who research and select the securities.",
      "Net Asset Value (NAV) is the price per share of the fund. It is calculated daily based on the total value of the fund's assets."
    ],
    summary: "A vehicle for pooling money to invest in a diversified portfolio managed by professionals.",
    keyTakeaways: [
      "Instant diversification.",
      "Professional management.",
      "Pooled resources from many investors."
    ],
    questions: [
      {
        id: 'q1',
        question: 'What is the main benefit of mutual funds?',
        options: ['Guaranteed returns', 'Diversification', 'No fees', 'Free insurance'],
        correctAnswer: 1
      },
      {
        id: 'q2',
        question: 'Who manages the investments in a mutual fund?',
        options: ['The government', 'Stock robots', 'Professional fund managers', 'The bank teller'],
        correctAnswer: 2
      },
      {
        id: 'q3',
        question: 'What does NAV stand for?',
        options: ['Net Average Value', 'New Asset Valuation', 'Net Asset Value', 'National Association of Value'],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 'l7',
    title: 'Credit Score Explained',
    category: 'Basics',
    durationMinutes: 6,
    content: [
      "Your credit score is a three-digit number, typically between 300 and 850, that represents your creditworthiness. Lenders use it to decide whether to lend you money and at what interest rate.",
      "The two biggest factors affecting your score are Payment History (35%) and Amounts Owed/Utilization (30%). This means paying on time and keeping balances low are the best ways to improve your score.",
      "Other factors include Length of Credit History (15%), New Credit/Inquiries (10%), and Credit Mix (10%).",
      "A higher score opens doors to lower interest rates on mortgages and cars, approval for premium credit cards, and even better approval odds for renting apartments.",
      "You should check your credit report regularly to ensure there are no errors, as mistakes can drag your score down."
    ],
    summary: "A numerical summary of your credit health that determines your borrowing power.",
    keyTakeaways: [
      "Payment history is the biggest factor.",
      "Keep utilization low (below 30%).",
      "High scores save money on interest."
    ],
    questions: [
      {
        id: 'q1',
        question: 'What is the most impactful factor on your credit score?',
        options: ['Credit Mix', 'Payment History', 'New Credit', 'Total Debt'],
        correctAnswer: 1
      },
      {
        id: 'q2',
        question: 'A good rule of thumb is to keep credit utilization below:',
        options: ['50%', '100%', '30%', '10%'],
        correctAnswer: 2
      },
      {
        id: 'q3',
        question: 'Who uses your credit score?',
        options: ['Your friends', 'Lenders and landlords', 'Grocery stores', 'Libraries'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'l8',
    title: 'How Inflation Affects Money',
    category: 'Basics',
    durationMinutes: 5,
    content: [
      "Inflation is the rate at which the general level of prices for goods and services is rising and, consequently, the purchasing power of currency is falling.",
      "If inflation is 3% per year, a $100 item will cost $103 next year. This means your money buys less over time.",
      "Cash hiding under a mattress loses value every year due to inflation. To preserve wealth, your money must grow at a rate equal to or higher than inflation.",
      "Investing in assets like stocks, real estate, or inflation-protected securities is generally seen as a hedge against inflation.",
      "While moderate inflation is a sign of a growing economy, hyperinflation can destroy an economy and personal savings."
    ],
    summary: "The silent erosion of purchasing power over time.",
    keyTakeaways: [
      "Inflation reduces what your money can buy.",
      "Cash loses value over time.",
      "Investing is necessary to beat inflation."
    ],
    questions: [
      {
        id: 'q1',
        question: 'What happens to purchasing power during inflation?',
        options: ['It increases', 'It stays the same', 'It decreases', 'It doubles'],
        correctAnswer: 2
      },
      {
        id: 'q2',
        question: 'Why is keeping all savings in cash risky?',
        options: ['It might get stolen', 'Inflation erodes its value', 'Banks charge fees', 'It gets moldy'],
        correctAnswer: 1
      },
      {
        id: 'q3',
        question: 'What is a common hedge against inflation?',
        options: ['Keeping cash', 'Investing in assets', 'Selling everything', 'Spending it all'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'l9',
    title: 'Introduction to Tax Planning',
    category: 'Basics',
    durationMinutes: 7,
    content: [
      "Tax planning is the analysis of a financial situation from a tax perspective to align financial goals with tax efficiency. It is about keeping more of what you earn legally.",
      "There is a difference between Tax Avoidance (legal usage of the tax regime to your advantage) and Tax Evasion (illegal non-payment).",
      "Key strategies include maximizing contributions to tax-advantaged accounts like 401(k)s or IRAs. These reduce your taxable income in the present year.",
      "Understanding deductions is crucial. Standard deductions are fixed amounts, while itemized deductions list specific expenses. You choose whichever lowers your tax bill more.",
      "Capital gains tax applies to profit from selling assets. Holding assets for more than a year often qualifies for lower long-term capital gains rates."
    ],
    summary: "Strategies to legally minimize tax liability and maximize take-home wealth.",
    keyTakeaways: [
      "Tax avoidance is legal; evasion is not.",
      "Use tax-advantaged accounts.",
      "Long-term holdings often have lower tax rates."
    ],
    questions: [
      {
        id: 'q1',
        question: 'What is the main goal of tax planning?',
        options: ['Evading taxes', 'Paying maximum tax', 'Tax efficiency', 'Hiding money'],
        correctAnswer: 2
      },
      {
        id: 'q2',
        question: 'Which of these is generally taxable at a lower rate?',
        options: ['Regular income', 'Short-term capital gains', 'Long-term capital gains', 'Bonuses'],
        correctAnswer: 2
      },
      {
        id: 'q3',
        question: 'Using a 401(k) to lower taxable income is an example of:',
        options: ['Tax Evasion', 'Tax Avoidance', 'Tax Fraud', 'Tax Negligence'],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'l10',
    title: 'Diversification & Asset Allocation',
    category: 'Investing',
    durationMinutes: 6,
    content: [
      "Asset allocation involves dividing an investment portfolio among different asset categories, such as stocks, bonds, and cash. The process depends on your time horizon and ability to tolerate risk.",
      "Diversification is the practice of spreading your investments around so that your exposure to any one type of asset is limited. It's often summarized as 'Don't put all your eggs in one basket.'",
      "Different assets perform differently at different times. When stocks are down, bonds might be up. A diversified portfolio helps smooth out the ups and downs (volatility).",
      "A common rule of thumb for asset allocation is 100 minus your age equals the percentage of your portfolio that should be in stocks (equities), though modern advice often suggests 110 or 120 minus age due to longer lifespans.",
      "Rebalancing is the process of realigning the weightings of your portfolio of assets. It involves periodically buying or selling assets to maintain your original or desired level of asset allocation."
    ],
    summary: "Managing risk by spreading investments across different asset classes.",
    keyTakeaways: [
      "Don't put all eggs in one basket.",
      "Asset allocation depends on risk tolerance.",
      "Rebalancing maintains your strategy."
    ],
    questions: [
      {
        id: 'q1',
        question: 'The main purpose of diversification is to:',
        options: ['Maximize returns', 'Reduce risk', 'Eliminate fees', 'Speed up growth'],
        correctAnswer: 1
      },
      {
        id: 'q2',
        question: 'Asset allocation is primarily based on:',
        options: ['Hot stock tips', 'Market timing', 'Risk tolerance and time horizon', 'News headlines'],
        correctAnswer: 2
      },
      {
        id: 'q3',
        question: 'What is rebalancing?',
        options: ['Buying more stocks', 'Selling everything', 'Resetting portfolio to target allocation', 'Withdrawing cash'],
        correctAnswer: 2
      }
    ]
  }
];