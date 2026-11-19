(function () {
    'use strict';

    const cases = {
        matched: {
            reportId: 'DEMO-Q3-01',
            invoices: [
                ['invoice-08.xml', 'DEMO-202608', '2026年08月', 109000],
                ['invoice-07.xml', 'DEMO-202607', '2026年07月', 109000],
                ['invoice-09.xml', 'DEMO-202609', '2026年09月', 109000]
            ],
            statement: 'statement.pdf',
            statementId: 'DEMO-Q2026-03',
            statementTotal: 327000,
            expectedZh: '购买方、销售方、税率和价税合计均为三方一致。计费月份数为 3，合约价税合计为 ¥327,000.00。',
            expectedEn: 'Buyer, seller, tax rate, and total all match. The billing month count is 3 and the contract total is CNY 327,000.00.'
        },
        'amount-mismatch': {
            reportId: 'DEMO-Q3-02',
            invoices: [
                ['invoice-08.xml', 'DEMO-202608', '2026年08月', 109000],
                ['invoice-07.xml', 'DEMO-202607', '2026年07月', 109000],
                ['invoice-09.xml', 'DEMO-202609', '2026年09月', 109000]
            ],
            statement: 'statement-mismatch.pdf',
            statementId: 'DEMO-Q2026-04',
            statementTotal: 337900,
            expectedZh: '购买方、销售方和税率一致。对账单价税合计为 ¥337,900.00，与发票、合约的 ¥327,000.00 有差异，核验不通过。',
            expectedEn: 'Buyer, seller, and tax rate match. The statement total of CNY 337,900.00 differs from the invoice and contract total of CNY 327,000.00. Verification fails.'
        },
        'partial-months': {
            reportId: 'DEMO-Q3-03',
            invoices: [
                ['partial-01.xml', 'DEMO-P001', '2026年07月', 81750],
                ['partial-02.xml', 'DEMO-P002', '2026年08月', 81750],
                ['partial-03.xml', 'DEMO-P003', '2026年09月', 81750],
                ['partial-04.xml', 'DEMO-P004', '未填写', 81750]
            ],
            statement: 'statement.pdf',
            statementId: 'DEMO-Q2026-03',
            statementTotal: 327000,
            expectedZh: '四项比对通过。第 4 张发票缺少租赁月份，显示核验通过并提醒检查月份。已识别月份去重为 3，合约价税合计为 ¥327,000.00。',
            expectedEn: 'All four comparisons pass. Invoice 4 has no rental month, so a month warning appears. The 3 distinct recognized months give a contract total of CNY 327,000.00.'
        }
    };

    const requested = new URLSearchParams(location.search).get('case');
    const activeCase = Object.hasOwn(cases, requested) ? requested : 'matched';
    const sample = cases[activeCase];
    const currency = new Intl.NumberFormat('en-US', {
        style: 'currency', currency: 'CNY', currencyDisplay: 'narrowSymbol'
    });

    document.getElementById('report-id').textContent = sample.reportId;
    document.getElementById('invoice-count').textContent = sample.invoices.length + ' 张';
    document.getElementById('statement-id').textContent = sample.statementId;
    document.getElementById('statement-total').textContent = currency.format(sample.statementTotal);
    const statementLink = document.getElementById('InvoiceFileInit1_gvOTHERInv_ctl02_lbDownload');
    statementLink.href = './assets/' + sample.statement;
    statementLink.setAttribute('aria-label', '查看供应商对账单 PDF / Open statement PDF');
    document.getElementById('expected-zh').textContent = sample.expectedZh;
    document.getElementById('expected-en').textContent = sample.expectedEn;

    for (const link of document.querySelectorAll('[data-case]')) {
        if (link.dataset.case === activeCase) link.setAttribute('aria-current', 'page');
    }

    const body = document.querySelector('#InvoiceFileInit1_gvINV tbody');
    for (const [index, invoice] of sample.invoices.entries()) {
        const [file, number, month, amount] = invoice;
        const row = body.insertRow();
        for (const value of [index + 1, month, number, '9%', currency.format(amount)]) {
            row.insertCell().textContent = value;
        }
        row.cells[4].className = 'num';
        const link = document.createElement('a');
        link.className = 'file';
        link.href = './assets/' + file;
        link.textContent = 'XML';
        link.target = '_blank';
        link.rel = 'noopener';
        link.setAttribute('aria-label', '查看第 ' + (index + 1) + ' 张发票 XML / Open invoice XML');
        row.insertCell().appendChild(link);
    }
})();
