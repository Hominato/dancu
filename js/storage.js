/**
 * AmeriCU Credit Union Banking System
 * LocalStorage Central Database Layer
 */

const DATA_VERSION = 'v2.0-karlee';  // Bump this to force a reset on next load

const STORAGE_KEYS = {
    USER: 'americu_user',
    ACCOUNTS: 'americu_accounts',
    TRANSACTIONS: 'americu_transactions',
    BENEFICIARIES: 'americu_beneficiaries',
    CARDS: 'americu_cards',
    BILLS: 'americu_bills',
    NOTIFICATIONS: 'americu_notifications',
    MESSAGES: 'americu_messages',
    SETTINGS: 'americu_settings',
    AUTH: 'americu_auth'
};

// Initial Seed Data
const INITIAL_DATA = {
    user: {
        id: 'usr_001',
        firstName: 'Karlee',
        lastName: 'Grey',
        fullName: 'Karlee Grey',
        email: 'oeoeieoeow@gmail.com',
        phone: '(310) 242-3374',
        address: '1301 Taft Hwy 157',
        city: 'Bakersfield',
        state: 'CA',
        zip: '93307',
        dob: '1990-06-14',
        ssn: '•••-••-4471',
        memberNumber: 'ACU-204718',
        joinedDate: '2018-03-07',
        occupation: 'Real Estate Investor',
        employer: 'Grey Capital Holdings LLC',
        annualIncome: '$4,200,000',
        lastLogin: 'November 28, 2025 at 4:17 PM'
    },

    accounts: [
        {
            id: 'acc_checking',
            name: 'Premier Checking',
            accountNumber: '7731048291',
            mask: '8291',
            type: 'Checking',
            availableBalance: 4850000.00,
            currentBalance: 4850000.00,
            routingNumber: '322271627',
            apy: '0.25%',
            isPrimary: true,
            openedDate: '2018-03-07'
        },
        {
            id: 'acc_savings',
            name: 'High-Yield Savings',
            accountNumber: '7731049004',
            mask: '9004',
            type: 'Savings',
            availableBalance: 12500000.00,
            currentBalance: 12500000.00,
            routingNumber: '322271627',
            apy: '4.10%',
            isPrimary: false,
            openedDate: '2018-03-07'
        },
        {
            id: 'acc_money_market',
            name: 'Money Market Account',
            accountNumber: '7731051882',
            mask: '1882',
            type: 'Money Market',
            availableBalance: 9750000.00,
            currentBalance: 9750000.00,
            routingNumber: '322271627',
            apy: '4.55%',
            isPrimary: false,
            openedDate: '2019-06-20'
        },
        {
            id: 'acc_investment',
            name: 'Investment Reserve',
            accountNumber: '7731063341',
            mask: '3341',
            type: 'Savings',
            availableBalance: 7900000.00,
            currentBalance: 7900000.00,
            routingNumber: '322271627',
            apy: '4.85%',
            isPrimary: false,
            openedDate: '2021-01-15'
        }
    ],

    cards: [
        {
            id: 'crd_7291',
            cardholder: 'KARLEE GREY',
            number: '4716 3920 8841 7291',
            mask: '7291',
            exp: '03/29',
            cvv: '741',
            brand: 'VISA',
            type: 'Platinum Debit',
            linkedAccountId: 'acc_checking',
            status: 'Active',
            dailyLimit: 50000.00,
            monthlyLimit: 250000.00,
            spentThisMonth: 48320.00
        },
        {
            id: 'crd_5043',
            cardholder: 'KARLEE GREY',
            number: '5412 7600 3391 5043',
            mask: '5043',
            exp: '11/28',
            cvv: '209',
            brand: 'MASTERCARD',
            type: 'Business Debit',
            linkedAccountId: 'acc_money_market',
            status: 'Active',
            dailyLimit: 100000.00,
            monthlyLimit: 500000.00,
            spentThisMonth: 127500.00
        }
    ],

    beneficiaries: [
        {
            id: 'ben_201',
            name: 'Derek Hough',
            bankName: 'Wells Fargo Bank',
            accountNumber: '4411829300',
            mask: '9300',
            routingNumber: '121042882',
            accountType: 'Checking',
            nickname: 'Derek (Business Partner)'
        },
        {
            id: 'ben_202',
            name: 'Madison Grey',
            bankName: 'AmeriCU Credit Union',
            accountNumber: '7731090012',
            mask: '0012',
            routingNumber: '322271627',
            accountType: 'Savings',
            nickname: 'Madison (Sister)'
        },
        {
            id: 'ben_203',
            name: 'Grey Capital Holdings LLC',
            bankName: 'JP Morgan Chase',
            accountNumber: '9920038841',
            mask: '8841',
            routingNumber: '021000021',
            accountType: 'Business Checking',
            nickname: 'Business Operating Account'
        },
        {
            id: 'ben_204',
            name: 'Pacific Properties Trust',
            bankName: 'Bank of America',
            accountNumber: '3381200944',
            mask: '0944',
            routingNumber: '026009593',
            accountType: 'Checking',
            nickname: 'Property Management'
        }
    ],

    bills: [
        {
            id: 'bill_01',
            biller: 'SoCal Gas Company',
            category: 'Utilities',
            accountNumber: 'SCG-20489013',
            amount: 284.50,
            dueDate: '2025-12-01',
            status: 'Upcoming',
            autoPay: true
        },
        {
            id: 'bill_02',
            biller: 'Pacific Power & Electric',
            category: 'Utilities',
            accountNumber: 'PPE-77310044',
            amount: 612.80,
            dueDate: '2025-12-03',
            status: 'Upcoming',
            autoPay: true
        },
        {
            id: 'bill_03',
            biller: 'Kern County Property Tax',
            category: 'Taxes',
            accountNumber: 'KCT-93307-0044',
            amount: 18500.00,
            dueDate: '2025-12-10',
            status: 'Upcoming',
            autoPay: false
        },
        {
            id: 'bill_04',
            biller: 'AT&T Business',
            category: 'Utilities',
            accountNumber: 'ATT-BIZ-44819',
            amount: 390.00,
            dueDate: '2025-12-08',
            status: 'Upcoming',
            autoPay: true
        },
        {
            id: 'bill_05',
            biller: 'Bakersfield Water Resources',
            category: 'Utilities',
            accountNumber: 'BWR-30029-KG',
            amount: 145.00,
            dueDate: '2025-12-15',
            status: 'Upcoming',
            autoPay: false
        },
        {
            id: 'bill_06',
            biller: 'State Farm Insurance',
            category: 'Insurance',
            accountNumber: 'SF-INS-88210044',
            amount: 3200.00,
            dueDate: '2025-12-01',
            status: 'Upcoming',
            autoPay: true
        },
        {
            id: 'bill_07',
            biller: 'Pacific Properties HOA',
            category: 'Housing',
            accountNumber: 'PP-HOA-22910',
            amount: 875.00,
            dueDate: '2025-12-05',
            status: 'Upcoming',
            autoPay: true
        }
    ],

    notifications: [
        {
            id: 'ntf_01',
            type: 'transfer',
            title: 'Large Transfer Completed',
            message: '$500,000.00 wire transfer to Grey Capital Holdings LLC was processed successfully.',
            date: '2025-11-28T16:10:00Z',
            read: false
        },
        {
            id: 'ntf_02',
            type: 'security',
            title: 'Login from New Device',
            message: 'A login was recorded from macOS Safari — Bakersfield, CA. If this wasn\'t you, contact us immediately.',
            date: '2025-11-28T16:17:00Z',
            read: false
        },
        {
            id: 'ntf_03',
            type: 'system',
            title: 'October Statement Ready',
            message: 'Your October 2025 e-Statement is available for all 4 accounts.',
            date: '2025-11-01T08:00:00Z',
            read: true
        },
        {
            id: 'ntf_04',
            type: 'bill',
            title: 'Property Tax Due Soon',
            message: 'Kern County Property Tax ($18,500.00) is due December 10th.',
            date: '2025-11-25T10:00:00Z',
            read: true
        },
        {
            id: 'ntf_05',
            type: 'system',
            title: 'Money Market Rate Increase',
            message: 'Your Money Market APY has been updated to 4.55%. Your account is earning more.',
            date: '2025-10-15T09:00:00Z',
            read: true
        },
        {
            id: 'ntf_06',
            type: 'transfer',
            title: 'Dividend Interest Credited',
            message: '$47,812.50 in monthly dividend interest was credited to your High-Yield Savings.',
            date: '2025-11-01T00:01:00Z',
            read: true
        }
    ],

    messages: [
        {
            id: 'msg_01',
            sender: 'AmeriCU Support',
            subject: 'Welcome to AmeriCU Credit Union!',
            body: 'Dear Karlee, welcome to AmeriCU Credit Union. Your Premier Checking and High-Yield Savings accounts are now active. Our dedicated wealth management team is available at your convenience.',
            date: '2018-03-07T10:00:00Z',
            folder: 'inbox',
            read: true
        },
        {
            id: 'msg_02',
            sender: 'AmeriCU Wealth Management',
            subject: 'Money Market Account Opened — Rate Locked at 4.55%',
            body: 'Karlee, your new Money Market Account has been opened. Current APY is locked at 4.55% for the first 12 months. Minimum balance requirement: $100,000.',
            date: '2019-06-20T09:15:00Z',
            folder: 'inbox',
            read: true
        },
        {
            id: 'msg_03',
            sender: 'AmeriCU Security Team',
            subject: 'Platinum Card Issued & Activated',
            body: 'Your new VISA Platinum Debit card ending in 7291 has been issued and is ready for use. Daily limit set at $50,000.',
            date: '2021-03-10T14:00:00Z',
            folder: 'inbox',
            read: true
        },
        {
            id: 'msg_04',
            sender: 'AmeriCU Member Services',
            subject: 'Annual Dividend Summary — 2024',
            body: 'Dear Karlee, your 2024 total dividend earnings across all accounts totaled $943,812.40. Your Tax Form 1099-INT has been mailed to 1301 Taft Hwy 157, Bakersfield CA 93307.',
            date: '2025-01-15T11:00:00Z',
            folder: 'inbox',
            read: true
        },
        {
            id: 'msg_05',
            sender: 'AmeriCU Wealth Management',
            subject: 'Q3 2025 Portfolio Review Scheduled',
            body: 'Hi Karlee, your quarterly portfolio review is scheduled for October 14th, 2025 at 2:00 PM. Your relationship manager, Marcus Thornton, will be calling the number on file.',
            date: '2025-10-08T09:30:00Z',
            folder: 'inbox',
            read: false
        },
        {
            id: 'msg_06',
            sender: 'AmeriCU Security Team',
            subject: 'Wire Transfer Authorization Confirmed',
            body: 'Your wire transfer of $500,000 to Grey Capital Holdings LLC (JP Morgan Chase, routing 021000021) was authorized and processed on November 28, 2025.',
            date: '2025-11-28T16:15:00Z',
            folder: 'inbox',
            read: false
        }
    ],

    settings: {
        theme: 'dark',
        defaultAccount: 'acc_checking',
        currency: 'USD',
        emailNotifications: true,
        smsNotifications: true,
        mfaEnabled: true,
        biometricEnabled: true
    },

    auth: {
        isLoggedIn: true,
        mfaVerified: true,
        user: { email: 'oeoeieoeow@gmail.com', name: 'Karlee Grey' }
    },

    transactions: [
        // ── NOVEMBER 2025 ──────────────────────────────────────────────────────────
        { id: 'trx_n2501', merchant: 'Wire Transfer — Grey Capital Holdings LLC', category: 'Transfer', accountId: 'acc_checking', amount: 500000.00, type: 'debit', status: 'Completed', date: '2025-11-28T16:05:00', ref: 'TRX-20251128-9901', memo: 'Business Operating Capital' },
        { id: 'trx_n2502', merchant: 'Dividend Interest', category: 'Salary', accountId: 'acc_savings', amount: 47812.50, type: 'credit', status: 'Completed', date: '2025-11-01T00:01:00', ref: 'TRX-20251101-9800', memo: 'Monthly Dividend — High-Yield Savings' },
        { id: 'trx_n2503', merchant: 'Money Market Dividend', category: 'Salary', accountId: 'acc_money_market', amount: 37143.75, type: 'credit', status: 'Completed', date: '2025-11-01T00:02:00', ref: 'TRX-20251101-9801', memo: 'Monthly Dividend — Money Market' },
        { id: 'trx_n2504', merchant: 'Neiman Marcus Beverly Hills', category: 'Shopping', accountId: 'acc_checking', amount: 12480.00, type: 'debit', status: 'Completed', date: '2025-11-22T15:30:00', ref: 'TRX-20251122-8812', memo: 'Holiday Wardrobe' },
        { id: 'trx_n2505', merchant: 'Kern County Property Tax', category: 'Taxes', accountId: 'acc_checking', amount: 18500.00, type: 'debit', status: 'Completed', date: '2025-11-10T09:00:00', ref: 'TRX-20251110-8701', memo: 'Q4 Property Tax' },
        { id: 'trx_n2506', merchant: 'Pacific Properties HOA', category: 'Housing', accountId: 'acc_checking', amount: 875.00, type: 'debit', status: 'Completed', date: '2025-11-05T10:00:00', ref: 'TRX-20251105-8602', memo: 'November HOA Dues' },
        { id: 'trx_n2507', merchant: 'State Farm Insurance', category: 'Insurance', accountId: 'acc_checking', amount: 3200.00, type: 'debit', status: 'Completed', date: '2025-11-01T08:00:00', ref: 'TRX-20251101-8504', memo: 'Property & Auto Insurance Premium' },
        { id: 'trx_n2508', merchant: 'Grey Capital — Rental Income', category: 'Salary', accountId: 'acc_checking', amount: 84000.00, type: 'credit', status: 'Completed', date: '2025-11-03T08:00:00', ref: 'TRX-20251103-8503', memo: 'November Rental Portfolio Income' },
        { id: 'trx_n2509', merchant: 'SoFi Investments', category: 'Transfer', accountId: 'acc_investment', amount: 200000.00, type: 'debit', status: 'Completed', date: '2025-11-14T11:00:00', ref: 'TRX-20251114-8490', memo: 'Investment Distribution' },
        { id: 'trx_n2510', merchant: 'Whole Foods Market Bakersfield', category: 'Groceries', accountId: 'acc_checking', amount: 482.30, type: 'debit', status: 'Completed', date: '2025-11-19T17:45:00', ref: 'TRX-20251119-8411', memo: 'Weekly Grocery Run' },
        { id: 'trx_n2511', merchant: 'AT&T Business Account', category: 'Utilities', accountId: 'acc_checking', amount: 390.00, type: 'debit', status: 'Completed', date: '2025-11-08T09:00:00', ref: 'TRX-20251108-8390', memo: 'Business Phone & Internet' },
        { id: 'trx_n2512', merchant: 'Delta First Class — LAX to JFK', category: 'Travel', accountId: 'acc_checking', amount: 4820.00, type: 'debit', status: 'Completed', date: '2025-11-17T06:30:00', ref: 'TRX-20251117-8310', memo: 'Flight to New York' },
        { id: 'trx_n2513', merchant: 'The Ritz-Carlton New York', category: 'Travel', accountId: 'acc_checking', amount: 3900.00, type: 'debit', status: 'Completed', date: '2025-11-17T14:00:00', ref: 'TRX-20251117-8211', memo: '3-Night Stay' },
        { id: 'trx_n2514', merchant: 'Starbucks Reserve — Bakersfield', category: 'Groceries', accountId: 'acc_checking', amount: 28.50, type: 'debit', status: 'Completed', date: '2025-11-26T08:15:00', ref: 'TRX-20251126-8100', memo: 'Morning Coffee' },
        { id: 'trx_n2515', merchant: 'Investment Reserve Top-Up', category: 'Transfer', accountId: 'acc_investment', amount: 300000.00, type: 'credit', status: 'Completed', date: '2025-11-28T10:00:00', ref: 'TRX-20251128-8090', memo: 'Internal Transfer from Checking' },

        // ── OCTOBER 2025 ───────────────────────────────────────────────────────────
        { id: 'trx_o2501', merchant: 'Grey Capital — Rental Income', category: 'Salary', accountId: 'acc_checking', amount: 84000.00, type: 'credit', status: 'Completed', date: '2025-10-03T08:00:00', ref: 'TRX-20251003-7910', memo: 'October Rental Portfolio Income' },
        { id: 'trx_o2502', merchant: 'Dividend Interest', category: 'Salary', accountId: 'acc_savings', amount: 47812.50, type: 'credit', status: 'Completed', date: '2025-10-01T00:01:00', ref: 'TRX-20251001-7900', memo: 'Monthly Dividend — High-Yield Savings' },
        { id: 'trx_o2503', merchant: 'Money Market Dividend', category: 'Salary', accountId: 'acc_money_market', amount: 37143.75, type: 'credit', status: 'Completed', date: '2025-10-01T00:02:00', ref: 'TRX-20251001-7901', memo: 'Monthly Dividend — Money Market' },
        { id: 'trx_o2504', merchant: 'Saks Fifth Avenue', category: 'Shopping', accountId: 'acc_checking', amount: 6840.00, type: 'debit', status: 'Completed', date: '2025-10-14T13:20:00', ref: 'TRX-20251014-7801', memo: 'Fall Collection' },
        { id: 'trx_o2505', merchant: 'Kern Medical Specialist Group', category: 'Other', accountId: 'acc_checking', amount: 1850.00, type: 'debit', status: 'Completed', date: '2025-10-22T11:30:00', ref: 'TRX-20251022-7744', memo: 'Annual Health Screening' },
        { id: 'trx_o2506', merchant: 'Pacific Power & Electric', category: 'Utilities', accountId: 'acc_checking', amount: 612.80, type: 'debit', status: 'Completed', date: '2025-10-05T09:00:00', ref: 'TRX-20251005-7700', memo: 'Monthly Electric Bill' },
        { id: 'trx_o2507', merchant: 'American Airlines — LAX to MIA', category: 'Travel', accountId: 'acc_checking', amount: 2940.00, type: 'debit', status: 'Completed', date: '2025-10-18T05:45:00', ref: 'TRX-20251018-7621', memo: 'Real Estate Conference Miami' },
        { id: 'trx_o2508', merchant: 'Fontainebleau Hotel Miami', category: 'Travel', accountId: 'acc_checking', amount: 2200.00, type: 'debit', status: 'Completed', date: '2025-10-18T16:00:00', ref: 'TRX-20251018-7542', memo: '2-Night Conference Stay' },
        { id: 'trx_o2509', merchant: 'Pacific Properties HOA', category: 'Housing', accountId: 'acc_checking', amount: 875.00, type: 'debit', status: 'Completed', date: '2025-10-05T10:00:00', ref: 'TRX-20251005-7500', memo: 'October HOA Dues' },
        { id: 'trx_o2510', merchant: 'Home Depot — Property Maintenance', category: 'Shopping', accountId: 'acc_checking', amount: 3420.80, type: 'debit', status: 'Completed', date: '2025-10-11T14:30:00', ref: 'TRX-20251011-7410', memo: 'Rental Property Repairs' },
        { id: 'trx_o2511', merchant: 'Costco Wholesale Bakersfield', category: 'Groceries', accountId: 'acc_checking', amount: 891.40, type: 'debit', status: 'Completed', date: '2025-10-09T11:00:00', ref: 'TRX-20251009-7381', memo: 'Bulk Household Supplies' },

        // ── SEPTEMBER 2025 ─────────────────────────────────────────────────────────
        { id: 'trx_s2501', merchant: 'Grey Capital — Rental Income', category: 'Salary', accountId: 'acc_checking', amount: 84000.00, type: 'credit', status: 'Completed', date: '2025-09-03T08:00:00', ref: 'TRX-20250903-6910', memo: 'September Rental Portfolio Income' },
        { id: 'trx_s2502', merchant: 'Dividend Interest', category: 'Salary', accountId: 'acc_savings', amount: 47812.50, type: 'credit', status: 'Completed', date: '2025-09-01T00:01:00', ref: 'TRX-20250901-6900', memo: 'Monthly Dividend — High-Yield Savings' },
        { id: 'trx_s2503', merchant: 'Money Market Dividend', category: 'Salary', accountId: 'acc_money_market', amount: 37143.75, type: 'credit', status: 'Completed', date: '2025-09-01T00:02:00', ref: 'TRX-20250901-6901', memo: 'Monthly Dividend — Money Market' },
        { id: 'trx_s2504', merchant: 'Real Estate Purchase — 4809 Oak Ave', category: 'Transfer', accountId: 'acc_investment', amount: 1200000.00, type: 'debit', status: 'Completed', date: '2025-09-12T10:00:00', ref: 'TRX-20250912-6800', memo: 'Investment Property Acquisition' },
        { id: 'trx_s2505', merchant: 'International Spa & Wellness Retreat', category: 'Travel', accountId: 'acc_checking', amount: 8400.00, type: 'debit', status: 'Completed', date: '2025-09-20T12:00:00', ref: 'TRX-20250920-6720', memo: 'Rancho La Puerta Retreat — 7 nights' },
        { id: 'trx_s2506', merchant: 'Pacific Power & Electric', category: 'Utilities', accountId: 'acc_checking', amount: 612.80, type: 'debit', status: 'Completed', date: '2025-09-05T09:00:00', ref: 'TRX-20250905-6700', memo: 'Monthly Electric Bill' },
        { id: 'trx_s2507', merchant: 'Audi Beverly Hills — Service', category: 'Travel', accountId: 'acc_checking', amount: 2180.00, type: 'debit', status: 'Completed', date: '2025-09-16T13:00:00', ref: 'TRX-20250916-6641', memo: 'Annual Vehicle Service' },
        { id: 'trx_s2508', merchant: 'Pacific Properties HOA', category: 'Housing', accountId: 'acc_checking', amount: 875.00, type: 'debit', status: 'Completed', date: '2025-09-05T10:00:00', ref: 'TRX-20250905-6620', memo: 'September HOA Dues' },

        // ── AUGUST 2025 ────────────────────────────────────────────────────────────
        { id: 'trx_a2501', merchant: 'Grey Capital — Rental Income', category: 'Salary', accountId: 'acc_checking', amount: 84000.00, type: 'credit', status: 'Completed', date: '2025-08-04T08:00:00', ref: 'TRX-20250804-5910', memo: 'August Rental Portfolio Income' },
        { id: 'trx_a2502', merchant: 'Dividend Interest', category: 'Salary', accountId: 'acc_savings', amount: 47812.50, type: 'credit', status: 'Completed', date: '2025-08-01T00:01:00', ref: 'TRX-20250801-5900', memo: 'Monthly Dividend — High-Yield Savings' },
        { id: 'trx_a2503', merchant: 'Money Market Dividend', category: 'Salary', accountId: 'acc_money_market', amount: 37143.75, type: 'credit', status: 'Completed', date: '2025-08-01T00:02:00', ref: 'TRX-20250801-5901', memo: 'Monthly Dividend — Money Market' },
        { id: 'trx_a2504', merchant: 'Hertz Luxury — Bakersfield Airport', category: 'Travel', accountId: 'acc_checking', amount: 1840.00, type: 'debit', status: 'Completed', date: '2025-08-14T10:30:00', ref: 'TRX-20250814-5802', memo: 'Weekly Car Rental — Cadillac Escalade' },
        { id: 'trx_a2505', merchant: 'Williams-Sonoma', category: 'Shopping', accountId: 'acc_checking', amount: 3280.50, type: 'debit', status: 'Completed', date: '2025-08-20T15:00:00', ref: 'TRX-20250820-5741', memo: 'Kitchen Remodel Appliances' },
        { id: 'trx_a2506', merchant: 'Pacific Power & Electric', category: 'Utilities', accountId: 'acc_checking', amount: 612.80, type: 'debit', status: 'Completed', date: '2025-08-05T09:00:00', ref: 'TRX-20250805-5700', memo: 'Monthly Electric Bill' },
        { id: 'trx_a2507', merchant: 'SoCal Gas Company', category: 'Utilities', accountId: 'acc_checking', amount: 284.50, type: 'debit', status: 'Completed', date: '2025-08-06T09:30:00', ref: 'TRX-20250806-5690', memo: 'Monthly Gas Bill' },
        { id: 'trx_a2508', merchant: 'Pacific Properties HOA', category: 'Housing', accountId: 'acc_checking', amount: 875.00, type: 'debit', status: 'Completed', date: '2025-08-05T10:00:00', ref: 'TRX-20250805-5640', memo: 'August HOA Dues' },
        { id: 'trx_a2509', merchant: 'Internal Transfer to Savings', category: 'Transfer', accountId: 'acc_savings', amount: 150000.00, type: 'credit', status: 'Completed', date: '2025-08-18T14:00:00', ref: 'TRX-20250818-5580', memo: 'Monthly Savings Top-Up' },
        { id: 'trx_a2510', merchant: 'Gelson\'s Market', category: 'Groceries', accountId: 'acc_checking', amount: 624.10, type: 'debit', status: 'Completed', date: '2025-08-22T17:00:00', ref: 'TRX-20250822-5500', memo: 'Weekly Groceries' },

        // ── JULY 2025 ──────────────────────────────────────────────────────────────
        { id: 'trx_j2501', merchant: 'Grey Capital — Rental Income', category: 'Salary', accountId: 'acc_checking', amount: 84000.00, type: 'credit', status: 'Completed', date: '2025-07-03T08:00:00', ref: 'TRX-20250703-4910', memo: 'July Rental Portfolio Income' },
        { id: 'trx_j2502', merchant: 'Dividend Interest', category: 'Salary', accountId: 'acc_savings', amount: 47812.50, type: 'credit', status: 'Completed', date: '2025-07-01T00:01:00', ref: 'TRX-20250701-4900', memo: 'Monthly Dividend — High-Yield Savings' },
        { id: 'trx_j2503', merchant: 'Money Market Dividend', category: 'Salary', accountId: 'acc_money_market', amount: 37143.75, type: 'credit', status: 'Completed', date: '2025-07-01T00:02:00', ref: 'TRX-20250701-4901', memo: 'Monthly Dividend — Money Market' },
        { id: 'trx_j2504', merchant: 'United Airlines — LAX to LAS VEGAS', category: 'Travel', accountId: 'acc_checking', amount: 890.00, type: 'debit', status: 'Completed', date: '2025-07-04T06:00:00', ref: 'TRX-20250704-4810', memo: 'July 4th Weekend Trip' },
        { id: 'trx_j2505', merchant: 'Wynn Las Vegas Resort', category: 'Travel', accountId: 'acc_checking', amount: 6800.00, type: 'debit', status: 'Completed', date: '2025-07-04T15:00:00', ref: 'TRX-20250704-4741', memo: '3-Night Penthouse Suite' },
        { id: 'trx_j2506', merchant: 'Pacific Power & Electric', category: 'Utilities', accountId: 'acc_checking', amount: 612.80, type: 'debit', status: 'Completed', date: '2025-07-07T09:00:00', ref: 'TRX-20250707-4700', memo: 'Monthly Electric Bill' },
        { id: 'trx_j2507', merchant: 'Nordstrom — The Shops at River Park', category: 'Shopping', accountId: 'acc_checking', amount: 4120.00, type: 'debit', status: 'Completed', date: '2025-07-19T14:30:00', ref: 'TRX-20250719-4650', memo: 'Summer Collection Haul' },
        { id: 'trx_j2508', merchant: 'Pacific Properties HOA', category: 'Housing', accountId: 'acc_checking', amount: 875.00, type: 'debit', status: 'Completed', date: '2025-07-05T10:00:00', ref: 'TRX-20250705-4600', memo: 'July HOA Dues' },
        { id: 'trx_j2509', merchant: 'Wire to Madison Grey', category: 'Transfer', accountId: 'acc_checking', amount: 25000.00, type: 'debit', status: 'Completed', date: '2025-07-22T11:00:00', ref: 'TRX-20250722-4522', memo: 'Gift / Support Transfer' },

        // ── JUNE 2025 ──────────────────────────────────────────────────────────────
        { id: 'trx_jun2501', merchant: 'Grey Capital — Rental Income', category: 'Salary', accountId: 'acc_checking', amount: 84000.00, type: 'credit', status: 'Completed', date: '2025-06-03T08:00:00', ref: 'TRX-20250603-3910', memo: 'June Rental Portfolio Income' },
        { id: 'trx_jun2502', merchant: 'Dividend Interest', category: 'Salary', accountId: 'acc_savings', amount: 47812.50, type: 'credit', status: 'Completed', date: '2025-06-01T00:01:00', ref: 'TRX-20250601-3900', memo: 'Monthly Dividend — High-Yield Savings' },
        { id: 'trx_jun2503', merchant: 'Money Market Dividend', category: 'Salary', accountId: 'acc_money_market', amount: 37143.75, type: 'credit', status: 'Completed', date: '2025-06-01T00:02:00', ref: 'TRX-20250601-3901', memo: 'Monthly Dividend — Money Market' },
        { id: 'trx_jun2504', merchant: 'Luxury Pools & Landscaping Inc.', category: 'Housing', accountId: 'acc_checking', amount: 18400.00, type: 'debit', status: 'Completed', date: '2025-06-10T09:00:00', ref: 'TRX-20250610-3810', memo: 'Pool Renovation at Primary Residence' },
        { id: 'trx_jun2505', merchant: 'Cartier Boutique', category: 'Shopping', accountId: 'acc_checking', amount: 22800.00, type: 'debit', status: 'Completed', date: '2025-06-14T14:00:00', ref: 'TRX-20250614-3741', memo: 'Birthday Gift — Jewelry' },
        { id: 'trx_jun2506', merchant: 'Pacific Power & Electric', category: 'Utilities', accountId: 'acc_checking', amount: 612.80, type: 'debit', status: 'Completed', date: '2025-06-05T09:00:00', ref: 'TRX-20250605-3700', memo: 'Monthly Electric Bill' },
        { id: 'trx_jun2507', merchant: 'Nobu Bakersfield', category: 'Groceries', accountId: 'acc_checking', amount: 1842.00, type: 'debit', status: 'Completed', date: '2025-06-14T20:00:00', ref: 'TRX-20250614-3660', memo: 'Birthday Dinner — Party of 10' },
        { id: 'trx_jun2508', merchant: 'Pacific Properties HOA', category: 'Housing', accountId: 'acc_checking', amount: 875.00, type: 'debit', status: 'Completed', date: '2025-06-05T10:00:00', ref: 'TRX-20250605-3620', memo: 'June HOA Dues' },

        // ── Q1 2025 ────────────────────────────────────────────────────────────────
        { id: 'trx_q12501', merchant: 'Grey Capital — Rental Income', category: 'Salary', accountId: 'acc_checking', amount: 84000.00, type: 'credit', status: 'Completed', date: '2025-03-03T08:00:00', ref: 'TRX-20250303-2410', memo: 'March Rental Portfolio Income' },
        { id: 'trx_q12502', merchant: 'Grey Capital — Rental Income', category: 'Salary', accountId: 'acc_checking', amount: 84000.00, type: 'credit', status: 'Completed', date: '2025-02-03T08:00:00', ref: 'TRX-20250203-2310', memo: 'February Rental Portfolio Income' },
        { id: 'trx_q12503', merchant: 'Grey Capital — Rental Income', category: 'Salary', accountId: 'acc_checking', amount: 84000.00, type: 'credit', status: 'Completed', date: '2025-01-03T08:00:00', ref: 'TRX-20250103-2210', memo: 'January Rental Portfolio Income' },
        { id: 'trx_q12504', merchant: 'IRS Estimated Tax Payment', category: 'Taxes', accountId: 'acc_checking', amount: 320000.00, type: 'debit', status: 'Completed', date: '2025-01-15T10:00:00', ref: 'TRX-20250115-2200', memo: 'Q4 2024 Estimated Tax — EFTPS' },
        { id: 'trx_q12505', merchant: 'Dividend Interest', category: 'Salary', accountId: 'acc_savings', amount: 47812.50, type: 'credit', status: 'Completed', date: '2025-03-01T00:01:00', ref: 'TRX-20250301-2100', memo: 'Monthly Dividend — March' },
        { id: 'trx_q12506', merchant: 'Dividend Interest', category: 'Salary', accountId: 'acc_savings', amount: 47812.50, type: 'credit', status: 'Completed', date: '2025-02-01T00:01:00', ref: 'TRX-20250201-2050', memo: 'Monthly Dividend — February' },
        { id: 'trx_q12507', merchant: 'Dividend Interest', category: 'Salary', accountId: 'acc_savings', amount: 47812.50, type: 'credit', status: 'Completed', date: '2025-01-01T00:01:00', ref: 'TRX-20250101-2000', memo: 'Monthly Dividend — January' },
        { id: 'trx_q12508', merchant: 'Money Market Dividend', category: 'Salary', accountId: 'acc_money_market', amount: 37143.75, type: 'credit', status: 'Completed', date: '2025-03-01T00:02:00', ref: 'TRX-20250301-2101', memo: 'Monthly Dividend — March' },
        { id: 'trx_q12509', merchant: 'Money Market Dividend', category: 'Salary', accountId: 'acc_money_market', amount: 37143.75, type: 'credit', status: 'Completed', date: '2025-02-01T00:02:00', ref: 'TRX-20250201-2051', memo: 'Monthly Dividend — February' },
        { id: 'trx_q12510', merchant: 'Money Market Dividend', category: 'Salary', accountId: 'acc_money_market', amount: 37143.75, type: 'credit', status: 'Completed', date: '2025-01-01T00:02:00', ref: 'TRX-20250101-2001', memo: 'Monthly Dividend — January' },
        { id: 'trx_q12511', merchant: 'Tesla Dealership Bakersfield', category: 'Shopping', accountId: 'acc_checking', amount: 118400.00, type: 'debit', status: 'Completed', date: '2025-02-22T15:00:00', ref: 'TRX-20250222-1900', memo: 'Tesla Model S Plaid — Cash Purchase' },
        { id: 'trx_q12512', merchant: 'Internal Transfer to Investment Reserve', category: 'Transfer', accountId: 'acc_investment', amount: 500000.00, type: 'credit', status: 'Completed', date: '2025-03-28T10:00:00', ref: 'TRX-20250328-1880', memo: 'Q1 2025 Investment Top-Up' },
        { id: 'trx_q12513', merchant: 'Marriott Marquis — San Francisco', category: 'Travel', accountId: 'acc_checking', amount: 3840.00, type: 'debit', status: 'Completed', date: '2025-02-14T16:00:00', ref: 'TRX-20250214-1820', memo: "Valentine's Trip — 4 Nights" },

        // ── 2024 HIGHLIGHTS ────────────────────────────────────────────────────────
        { id: 'trx_2401', merchant: 'Grey Capital — Annual Rental Income', category: 'Salary', accountId: 'acc_checking', amount: 1008000.00, type: 'credit', status: 'Completed', date: '2024-12-31T23:00:00', ref: 'TRX-20241231-1100', memo: '2024 Annual Rental Portfolio Summary Credit' },
        { id: 'trx_2402', merchant: 'IRS Estimated Tax Q4', category: 'Taxes', accountId: 'acc_checking', amount: 320000.00, type: 'debit', status: 'Completed', date: '2024-01-15T10:00:00', ref: 'TRX-20240115-1000', memo: 'Q4 2023 Estimated Tax' },
        { id: 'trx_2403', merchant: 'Annual Dividend — High-Yield Savings', category: 'Salary', accountId: 'acc_savings', amount: 573750.00, type: 'credit', status: 'Completed', date: '2024-12-31T23:30:00', ref: 'TRX-20241231-1090', memo: '2024 Annual Dividend Total' },
        { id: 'trx_2404', merchant: 'Real Estate Sale — 702 Chester Ave', category: 'Salary', accountId: 'acc_checking', amount: 1850000.00, type: 'credit', status: 'Completed', date: '2024-08-14T12:00:00', ref: 'TRX-20240814-0980', memo: 'Property Sale Proceeds' },
        { id: 'trx_2405', merchant: 'Internal Transfer to Money Market', category: 'Transfer', accountId: 'acc_money_market', amount: 750000.00, type: 'credit', status: 'Completed', date: '2024-08-15T09:00:00', ref: 'TRX-20240815-0970', memo: 'Post-Sale Reinvestment' },
        { id: 'trx_2406', merchant: 'European Vacation — Air + Hotel', category: 'Travel', accountId: 'acc_checking', amount: 34800.00, type: 'debit', status: 'Completed', date: '2024-07-01T06:00:00', ref: 'TRX-20240701-0910', memo: 'Italy & France — 3 Weeks' },
        { id: 'trx_2407', merchant: 'Hermès Beverly Hills', category: 'Shopping', accountId: 'acc_checking', amount: 18400.00, type: 'debit', status: 'Completed', date: '2024-10-11T13:00:00', ref: 'TRX-20241011-0880', memo: 'Birkin Handbag' },
        { id: 'trx_2408', merchant: 'Kern County Property Tax 2024', category: 'Taxes', accountId: 'acc_checking', amount: 74200.00, type: 'debit', status: 'Completed', date: '2024-11-01T09:00:00', ref: 'TRX-20241101-0850', memo: 'Annual Property Taxes — All Properties' },
        { id: 'trx_2409', merchant: 'Grey Capital — New Property Purchase', category: 'Transfer', accountId: 'acc_investment', amount: 2100000.00, type: 'debit', status: 'Completed', date: '2024-04-22T10:00:00', ref: 'TRX-20240422-0810', memo: '302 Mill Rock Way — Investment Purchase' },
        { id: 'trx_2410', merchant: 'Mercedes-Benz of Bakersfield', category: 'Shopping', accountId: 'acc_checking', amount: 212000.00, type: 'debit', status: 'Completed', date: '2024-03-18T14:00:00', ref: 'TRX-20240318-0780', memo: 'G-Wagon G63 — Cash' },

        // ── 2023 HIGHLIGHTS ────────────────────────────────────────────────────────
        { id: 'trx_2301', merchant: 'Grey Capital — Annual Rental Income', category: 'Salary', accountId: 'acc_checking', amount: 912000.00, type: 'credit', status: 'Completed', date: '2023-12-31T23:00:00', ref: 'TRX-20231231-0600', memo: '2023 Annual Rental Income' },
        { id: 'trx_2302', merchant: 'Annual Dividend — High-Yield Savings', category: 'Salary', accountId: 'acc_savings', amount: 481250.00, type: 'credit', status: 'Completed', date: '2023-12-31T23:30:00', ref: 'TRX-20231231-0590', memo: '2023 Annual Dividend Total' },
        { id: 'trx_2303', merchant: 'IRS Annual Tax Payment 2022', category: 'Taxes', accountId: 'acc_checking', amount: 290000.00, type: 'debit', status: 'Completed', date: '2023-04-18T10:00:00', ref: 'TRX-20230418-0550', memo: 'Federal Income Tax Return Payment' },
        { id: 'trx_2304', merchant: 'Kern County Property Tax 2023', category: 'Taxes', accountId: 'acc_checking', amount: 68400.00, type: 'debit', status: 'Completed', date: '2023-11-01T09:00:00', ref: 'TRX-20231101-0530', memo: 'Annual Property Taxes' },
        { id: 'trx_2305', merchant: 'Las Vegas Investment Summit', category: 'Travel', accountId: 'acc_checking', amount: 12400.00, type: 'debit', status: 'Completed', date: '2023-09-12T08:00:00', ref: 'TRX-20230912-0510', memo: 'Conference Registration + Hotel + Flight' },
        { id: 'trx_2306', merchant: 'Grey Capital — Property Acquisition', category: 'Transfer', accountId: 'acc_investment', amount: 1750000.00, type: 'debit', status: 'Completed', date: '2023-06-01T10:00:00', ref: 'TRX-20230601-0490', memo: '5810 Panama Lane — Investment Property' },
        { id: 'trx_2307', merchant: 'Maserati Bakersfield', category: 'Shopping', accountId: 'acc_checking', amount: 148000.00, type: 'debit', status: 'Completed', date: '2023-02-10T14:00:00', ref: 'TRX-20230210-0450', memo: 'Maserati Levante Trofeo — Cash' },
        { id: 'trx_2308', merchant: 'Home Renovation — Primary Residence', category: 'Housing', accountId: 'acc_checking', amount: 185000.00, type: 'debit', status: 'Completed', date: '2023-07-01T09:00:00', ref: 'TRX-20230701-0440', memo: 'Full Kitchen & Master Bath Renovation' },

        // ── 2022 HIGHLIGHTS ────────────────────────────────────────────────────────
        { id: 'trx_2201', merchant: 'Grey Capital — Annual Rental Income', category: 'Salary', accountId: 'acc_checking', amount: 780000.00, type: 'credit', status: 'Completed', date: '2022-12-31T23:00:00', ref: 'TRX-20221231-0300', memo: '2022 Annual Rental Income' },
        { id: 'trx_2202', merchant: 'Annual Dividend — High-Yield Savings', category: 'Salary', accountId: 'acc_savings', amount: 380000.00, type: 'credit', status: 'Completed', date: '2022-12-31T23:30:00', ref: 'TRX-20221231-0290', memo: '2022 Annual Dividend Total' },
        { id: 'trx_2203', merchant: 'Grey Capital — Property Acquisition', category: 'Transfer', accountId: 'acc_investment', amount: 1400000.00, type: 'debit', status: 'Completed', date: '2022-03-14T10:00:00', ref: 'TRX-20220314-0250', memo: '8901 Stockdale Hwy — Investment Property' },
        { id: 'trx_2204', merchant: 'Kern County Property Tax 2022', category: 'Taxes', accountId: 'acc_checking', amount: 54800.00, type: 'debit', status: 'Completed', date: '2022-11-01T09:00:00', ref: 'TRX-20221101-0240', memo: 'Annual Property Taxes' },
        { id: 'trx_2205', merchant: 'Internal Transfer — Investment Reserve Opened', category: 'Transfer', accountId: 'acc_investment', amount: 2000000.00, type: 'credit', status: 'Completed', date: '2022-01-15T10:00:00', ref: 'TRX-20220115-0220', memo: 'Investment Reserve Account Seeded' },
        { id: 'trx_2206', merchant: 'Miami Luxury Real Estate Conference', category: 'Travel', accountId: 'acc_checking', amount: 9800.00, type: 'debit', status: 'Completed', date: '2022-05-10T07:00:00', ref: 'TRX-20220510-0200', memo: 'Conference + Hotel Faena Miami' },

        // ── 2021 HIGHLIGHTS ────────────────────────────────────────────────────────
        { id: 'trx_2101', merchant: 'Grey Capital — Annual Rental Income', category: 'Salary', accountId: 'acc_checking', amount: 648000.00, type: 'credit', status: 'Completed', date: '2021-12-31T23:00:00', ref: 'TRX-20211231-0150', memo: '2021 Annual Rental Income' },
        { id: 'trx_2102', merchant: 'Annual Dividend — High-Yield Savings', category: 'Salary', accountId: 'acc_savings', amount: 320000.00, type: 'credit', status: 'Completed', date: '2021-12-31T23:30:00', ref: 'TRX-20211231-0140', memo: '2021 Annual Dividend Total' },
        { id: 'trx_2103', merchant: 'Grey Capital LLC — Incorporation Fees', category: 'Other', accountId: 'acc_checking', amount: 4800.00, type: 'debit', status: 'Completed', date: '2021-01-12T10:00:00', ref: 'TRX-20210112-0120', memo: 'CA LLC Formation & Legal Fees' },
        { id: 'trx_2104', merchant: 'Grey Capital — Property Acquisition', category: 'Transfer', accountId: 'acc_investment', amount: 985000.00, type: 'debit', status: 'Completed', date: '2021-08-20T10:00:00', ref: 'TRX-20210820-0100', memo: '3120 Wilson Road — Investment Property' },
        { id: 'trx_2105', merchant: 'Kern County Property Tax 2021', category: 'Taxes', accountId: 'acc_checking', amount: 38400.00, type: 'debit', status: 'Completed', date: '2021-11-01T09:00:00', ref: 'TRX-20211101-0090', memo: 'Annual Property Taxes' },
        { id: 'trx_2106', merchant: 'Internal Transfer to Money Market', category: 'Transfer', accountId: 'acc_money_market', amount: 500000.00, type: 'credit', status: 'Completed', date: '2021-06-15T10:00:00', ref: 'TRX-20210615-0080', memo: 'Mid-Year Money Market Top-Up' },

        // ── 2020 HIGHLIGHTS ────────────────────────────────────────────────────────
        { id: 'trx_2001', merchant: 'Grey Capital — Annual Rental Income', category: 'Salary', accountId: 'acc_checking', amount: 520000.00, type: 'credit', status: 'Completed', date: '2020-12-31T23:00:00', ref: 'TRX-20201231-0070', memo: '2020 Annual Rental Income' },
        { id: 'trx_2002', merchant: 'Annual Dividend — High-Yield Savings', category: 'Salary', accountId: 'acc_savings', amount: 210000.00, type: 'credit', status: 'Completed', date: '2020-12-31T23:30:00', ref: 'TRX-20201231-0060', memo: '2020 Annual Dividend Total' },
        { id: 'trx_2003', merchant: 'Bakersfield Commercial Property', category: 'Transfer', accountId: 'acc_savings', amount: 880000.00, type: 'debit', status: 'Completed', date: '2020-08-10T10:00:00', ref: 'TRX-20200810-0050', memo: 'Commercial Strip Mall — Acquisition' },
        { id: 'trx_2004', merchant: 'Kern County Property Tax 2020', category: 'Taxes', accountId: 'acc_checking', amount: 28100.00, type: 'debit', status: 'Completed', date: '2020-11-01T09:00:00', ref: 'TRX-20201101-0040', memo: 'Annual Property Taxes' },

        // ── 2019 HIGHLIGHTS ────────────────────────────────────────────────────────
        { id: 'trx_1901', merchant: 'Grey Capital — Annual Rental Income', category: 'Salary', accountId: 'acc_checking', amount: 420000.00, type: 'credit', status: 'Completed', date: '2019-12-31T23:00:00', ref: 'TRX-20191231-0030', memo: '2019 Annual Rental Income' },
        { id: 'trx_1902', merchant: 'Annual Dividend — High-Yield Savings', category: 'Salary', accountId: 'acc_savings', amount: 125000.00, type: 'credit', status: 'Completed', date: '2019-12-31T23:30:00', ref: 'TRX-20191231-0025', memo: '2019 Annual Dividend Total' },
        { id: 'trx_1903', merchant: 'Money Market Account Opened', category: 'Transfer', accountId: 'acc_money_market', amount: 1000000.00, type: 'credit', status: 'Completed', date: '2019-06-20T10:00:00', ref: 'TRX-20190620-0020', memo: 'Initial Money Market Funding' },
        { id: 'trx_1904', merchant: 'Kern County Property Tax 2019', category: 'Taxes', accountId: 'acc_checking', amount: 14200.00, type: 'debit', status: 'Completed', date: '2019-11-01T09:00:00', ref: 'TRX-20191101-0018', memo: 'Annual Property Taxes' },
        { id: 'trx_1905', merchant: 'First Investment Property Purchase', category: 'Transfer', accountId: 'acc_savings', amount: 420000.00, type: 'debit', status: 'Completed', date: '2019-03-14T10:00:00', ref: 'TRX-20190314-0015', memo: '2201 White Ln, Bakersfield — First Rental' },

        // ── 2018 — ACCOUNT OPENING ─────────────────────────────────────────────────
        { id: 'trx_1801', merchant: 'Initial Deposit — Account Opening', category: 'Transfer', accountId: 'acc_checking', amount: 250000.00, type: 'credit', status: 'Completed', date: '2018-03-07T10:30:00', ref: 'TRX-20180307-0001', memo: 'Opening Deposit — Premier Checking' },
        { id: 'trx_1802', merchant: 'Initial Deposit — High-Yield Savings', category: 'Transfer', accountId: 'acc_savings', amount: 1500000.00, type: 'credit', status: 'Completed', date: '2018-03-07T10:35:00', ref: 'TRX-20180307-0002', memo: 'Opening Deposit — High-Yield Savings' },
        { id: 'trx_1803', merchant: 'Annual Dividend — High-Yield Savings', category: 'Salary', accountId: 'acc_savings', amount: 48750.00, type: 'credit', status: 'Completed', date: '2018-12-31T23:30:00', ref: 'TRX-20181231-0010', memo: '2018 Annual Dividend Total' },
        { id: 'trx_1804', merchant: 'Grey Capital — Rental Income Q3–Q4 2018', category: 'Salary', accountId: 'acc_checking', amount: 180000.00, type: 'credit', status: 'Completed', date: '2018-12-31T22:00:00', ref: 'TRX-20181231-0009', memo: 'Rental Income — First Year (Q3+Q4)' },
        { id: 'trx_1805', merchant: 'Kern County Property Tax 2018', category: 'Taxes', accountId: 'acc_checking', amount: 8400.00, type: 'debit', status: 'Completed', date: '2018-11-01T09:00:00', ref: 'TRX-20181101-0005', memo: 'Annual Property Taxes — First Year' },
        { id: 'trx_1806', merchant: 'Saks Fifth Avenue', category: 'Shopping', accountId: 'acc_checking', amount: 5820.00, type: 'debit', status: 'Completed', date: '2018-10-08T14:30:00', ref: 'TRX-20181008-0004', memo: 'Fall Wardrobe Purchase' }
    ]
};

// LocalStorage & In-Memory Controller Object
const Storage = {
    db: null,

    init() {
        const storedVersion = localStorage.getItem('americu_data_version');
        if (!storedVersion || storedVersion !== DATA_VERSION) {
            // Clear all old data and seed fresh profile into memory & storage
            Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
            localStorage.setItem('americu_data_version', DATA_VERSION);
            this.resetToDefaults();
        } else {
            this.loadFromStorage();
        }
    },

    loadFromStorage() {
        this.db = {
            user: JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)) || INITIAL_DATA.user,
            accounts: JSON.parse(localStorage.getItem(STORAGE_KEYS.ACCOUNTS)) || INITIAL_DATA.accounts,
            cards: JSON.parse(localStorage.getItem(STORAGE_KEYS.CARDS)) || INITIAL_DATA.cards,
            beneficiaries: JSON.parse(localStorage.getItem(STORAGE_KEYS.BENEFICIARIES)) || INITIAL_DATA.beneficiaries,
            bills: JSON.parse(localStorage.getItem(STORAGE_KEYS.BILLS)) || INITIAL_DATA.bills,
            notifications: JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) || INITIAL_DATA.notifications,
            messages: JSON.parse(localStorage.getItem(STORAGE_KEYS.MESSAGES)) || INITIAL_DATA.messages,
            settings: JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS)) || INITIAL_DATA.settings,
            auth: JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTH)) || INITIAL_DATA.auth,
            transactions: JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) || INITIAL_DATA.transactions
        };
    },

    resetToDefaults() {
        this.db = JSON.parse(JSON.stringify(INITIAL_DATA));
        this.saveAllToStorage();
    },

    saveAllToStorage() {
        if (!this.db) return;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(this.db.user));
        localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(this.db.accounts));
        localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(this.db.cards));
        localStorage.setItem(STORAGE_KEYS.BENEFICIARIES, JSON.stringify(this.db.beneficiaries));
        localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(this.db.bills));
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(this.db.notifications));
        localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(this.db.messages));
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.db.settings));
        localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(this.db.auth));
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(this.db.transactions));
    },

    // User Operations
    getUser() {
        if (!this.db) this.init();
        return this.db.user || INITIAL_DATA.user;
    },

    saveUser(userObject) {
        if (!this.db) this.init();
        this.db.user = userObject;
        INITIAL_DATA.user = userObject;
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userObject));
    },

    // Accounts Operations
    getAccounts() {
        if (!this.db) this.init();
        return this.db.accounts || INITIAL_DATA.accounts;
    },

    getAccountById(id) {
        const accounts = this.getAccounts();
        return accounts.find(acc => acc.id === id);
    },

    saveAccounts(accountsArray) {
        if (!this.db) this.init();
        this.db.accounts = accountsArray;
        INITIAL_DATA.accounts = accountsArray;
        localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accountsArray));
    },

    updateBalance(accountId, amountChange) {
        const accounts = this.getAccounts();
        const account = accounts.find(a => a.id === accountId);
        if (account) {
            account.availableBalance = parseFloat((account.availableBalance + amountChange).toFixed(2));
            account.currentBalance = parseFloat((account.currentBalance + amountChange).toFixed(2));
            this.saveAccounts(accounts);
        }
    },

    // Transactions Operations — Stores directly in storage.js memory database
    getTransactions() {
        if (!this.db) this.init();
        return this.db.transactions || INITIAL_DATA.transactions;
    },

    addTransaction(trx) {
        if (!this.db) this.init();
        const newTrx = {
            id: 'trx_' + Date.now(),
            date: new Date().toISOString(),
            status: 'Completed',
            ref: 'TRX-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + Math.floor(1000 + Math.random() * 9000),
            ...trx
        };
        // Insert directly into storage.js memory data store
        this.db.transactions.unshift(newTrx);
        INITIAL_DATA.transactions.unshift(newTrx);
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(this.db.transactions));
        return newTrx;
    },

    deleteTransaction(trxId) {
        if (!this.db) this.init();
        this.db.transactions = this.db.transactions.filter(t => t.id !== trxId);
        INITIAL_DATA.transactions = INITIAL_DATA.transactions.filter(t => t.id !== trxId);
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(this.db.transactions));
    },

    // Cards Operations
    getCards() {
        if (!this.db) this.init();
        return this.db.cards || INITIAL_DATA.cards;
    },

    toggleCardFreeze(cardId) {
        const cards = this.getCards();
        const card = cards.find(c => c.id === cardId);
        if (card) {
            card.status = card.status === 'Active' ? 'Frozen' : 'Active';
            this.db.cards = cards;
            INITIAL_DATA.cards = cards;
            localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
        }
        return card;
    },

    updateCardLimits(cardId, dailyLimit, monthlyLimit) {
        const cards = this.getCards();
        const card = cards.find(c => c.id === cardId);
        if (card) {
            card.dailyLimit = parseFloat(dailyLimit);
            card.monthlyLimit = parseFloat(monthlyLimit);
            this.db.cards = cards;
            INITIAL_DATA.cards = cards;
            localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
        }
        return card;
    },

    // Beneficiaries Operations
    getBeneficiaries() {
        if (!this.db) this.init();
        return this.db.beneficiaries || INITIAL_DATA.beneficiaries;
    },

    saveBeneficiary(beneficiary) {
        const beneficiaries = this.getBeneficiaries();
        if (beneficiary.id) {
            const index = beneficiaries.findIndex(b => b.id === beneficiary.id);
            if (index !== -1) beneficiaries[index] = beneficiary;
        } else {
            beneficiary.id = 'ben_' + Date.now();
            beneficiary.mask = beneficiary.accountNumber ? beneficiary.accountNumber.slice(-4) : '0000';
            beneficiaries.push(beneficiary);
        }
        this.db.beneficiaries = beneficiaries;
        INITIAL_DATA.beneficiaries = beneficiaries;
        localStorage.setItem(STORAGE_KEYS.BENEFICIARIES, JSON.stringify(beneficiaries));
        return beneficiary;
    },

    deleteBeneficiary(id) {
        let beneficiaries = this.getBeneficiaries();
        beneficiaries = beneficiaries.filter(b => b.id !== id);
        this.db.beneficiaries = beneficiaries;
        INITIAL_DATA.beneficiaries = beneficiaries;
        localStorage.setItem(STORAGE_KEYS.BENEFICIARIES, JSON.stringify(beneficiaries));
    },

    // Bills Operations
    getBills() {
        if (!this.db) this.init();
        return this.db.bills || INITIAL_DATA.bills;
    },

    saveBill(bill) {
        const bills = this.getBills();
        if (bill.id) {
            const index = bills.findIndex(b => b.id === bill.id);
            if (index !== -1) bills[index] = bill;
        } else {
            bill.id = 'bill_' + Date.now();
            bill.status = 'Upcoming';
            bills.push(bill);
        }
        this.db.bills = bills;
        INITIAL_DATA.bills = bills;
        localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
        return bill;
    },

    deleteBill(id) {
        let bills = this.getBills();
        bills = bills.filter(b => b.id !== id);
        this.db.bills = bills;
        INITIAL_DATA.bills = bills;
        localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
    },

    // Notifications Operations
    getNotifications() {
        if (!this.db) this.init();
        return this.db.notifications || INITIAL_DATA.notifications;
    },

    addNotification(notif) {
        const notifications = this.getNotifications();
        const newNotif = {
            id: 'ntf_' + Date.now(),
            date: new Date().toISOString(),
            read: false,
            ...notif
        };
        notifications.unshift(newNotif);
        this.db.notifications = notifications;
        INITIAL_DATA.notifications = notifications;
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
        return newNotif;
    },

    markNotificationsRead() {
        const notifications = this.getNotifications();
        notifications.forEach(n => n.read = true);
        this.db.notifications = notifications;
        INITIAL_DATA.notifications = notifications;
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    },

    deleteNotification(id) {
        let notifications = this.getNotifications();
        notifications = notifications.filter(n => n.id !== id);
        this.db.notifications = notifications;
        INITIAL_DATA.notifications = notifications;
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    },

    clearAllNotifications() {
        this.db.notifications = [];
        INITIAL_DATA.notifications = [];
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([]));
    },

    // Messages Operations
    getMessages() {
        if (!this.db) this.init();
        return this.db.messages || INITIAL_DATA.messages;
    },

    sendMessage({ subject, body, category = 'General Support' }) {
        const messages = this.getMessages();
        const newMessage = {
            id: 'msg_' + Date.now(),
            sender: 'You (Karlee Grey)',
            subject: subject,
            body: body,
            category: category,
            date: new Date().toISOString(),
            folder: 'sent',
            read: true
        };
        messages.unshift(newMessage);
        this.db.messages = messages;
        INITIAL_DATA.messages = messages;
        localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
        return newMessage;
    },

    markMessageRead(id) {
        const messages = this.getMessages();
        const msg = messages.find(m => m.id === id);
        if (msg) {
            msg.read = true;
            this.db.messages = messages;
            INITIAL_DATA.messages = messages;
            localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
        }
    },

    deleteMessage(id) {
        let messages = this.getMessages();
        messages = messages.filter(m => m.id !== id);
        this.db.messages = messages;
        INITIAL_DATA.messages = messages;
        localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    },

    // User & Profile Operations
    updateUserProfile(updatedFields) {
        const user = this.getUser();
        const newUser = { ...user, ...updatedFields };
        if (updatedFields.firstName || updatedFields.lastName) {
            newUser.fullName = `${newUser.firstName} ${newUser.lastName}`;
        }
        this.saveUser(newUser);
        return newUser;
    },

    // Settings Operations
    getSettings() {
        if (!this.db) this.init();
        return this.db.settings || INITIAL_DATA.settings;
    },

    saveSettings(settingsObj) {
        const settings = { ...this.getSettings(), ...settingsObj };
        this.db.settings = settings;
        INITIAL_DATA.settings = settings;
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
        return settings;
    },

    // Auth Operations
    getAuthSession() {
        if (!this.db) this.init();
        return this.db.auth || { isLoggedIn: false, mfaVerified: false };
    },

    setAuthSession(sessionObj) {
        if (!this.db) this.init();
        this.db.auth = sessionObj;
        INITIAL_DATA.auth = sessionObj;
        localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(sessionObj));
    },

    logout() {
        if (!this.db) this.init();
        this.db.auth = { isLoggedIn: false, mfaVerified: false };
        INITIAL_DATA.auth = { isLoggedIn: false, mfaVerified: false };
        localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(this.db.auth));
    }
};

// Initialize Storage immediately on load
Storage.init();

