import { Book, Author, ScanRecord } from './types';

export const BOOKS: Book[] = [
  {
    id: 'meditations',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgQZmOX2-yN6m7nlAur4cdPBx-78HU7niNfkm8oowhdAYwbim_9Kwi_4qcI-rVBBFfxtK74g_Gju2cgYp2gkYuLBobJ938bi--R7szq8C-5JiOMBkqywv3XMY4aW6IL-CtnJ9xV0F_-grvudu2dc-KzNpMor338aWWjM3m5SEoLBh8TimToV8UoJT4GBtt6Hw-83n395cGUSyFatFonJEq4Y70lwUf7dOqn1ITrtVQGxYWkxrLw2a5_LMuF5vXP8pjOxJEcLRAmzJd',
    status: 'Read',
    category: 'Philosophy',
    summary: 'A series of personal writings by Roman Emperor Marcus Aurelius, setting forth his private notes to himself and ideas on Stoic philosophy. It offers a guide to living a life of virtue, reason, and tranquility, even amidst chaos and adversity.',
    philosophy: 'The central philosophy revolves around finding peace by accepting what is outside one\'s control and mastering one\'s own mind and reactions. True happiness comes from living a virtuous life in accordance with nature and reason.',
    mainIdeas: [
      'Focus on what you can control; accept what you cannot.',
      'Live in harmony with nature and your own rational mind.',
      'Recognize the impermanence of all things to find perspective.'
    ]
  },
  {
    id: 'fifth-season',
    title: 'The Fifth Season',
    author: 'N. K. Jemisin',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAG_Se529IBFAay6EP0t0aO_ROPbTHJMQec7zfmEkKbNukA0GSSx6jHPlrCTpAG4bU_yFIlJpRSOcnF9TDR7qPL1AR5RruR3QYQIOk2b4nyODwVs5WvQuxGx2BK6VX1PLJQy5r1H4Klp0-UnNrmlDcfibnFSI1w7euvsf1--Aalnukp-z62KaxIR0qKL13eDpRLACuSdIVwwjhwFNZMXzVRLH4MSst1NtqFE2U_0vdzco1S2GpE0QdACMfiRshyM4hT6zq06gAlKoku',
    status: 'Read',
    year: '2015'
  },
  {
    id: 'psalm-wild',
    title: 'A Psalm for the Wild-Built',
    author: 'Becky Chambers',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAciyxHSkpbDTfaB3EhLMiELRITJALE6hWQngIpUFBnovdBezAoJWxGxj-IYsEHyNYCyj6ZLD7pTogHC7gvEEFd4K8bX_0PwSLQ-DcbZDO27r88_2hOjoTR540Egk8Nc89oTY7Rsd8QbnEyYjbg7LLTFTOMFg8uv_25rVYyM19VCU9u5VwCH1TQLD6Dfq7wa56iWTjiImSo9hadAXi16uPtzgK5YUXFdqExKd3djTvEfmeDd0R_04skTn48oAjE6zUqfOqTJ5Fwpe-Y',
    status: 'To Read',
    year: '2021'
  },
  {
    id: 'parable-sower',
    title: 'Parable of the Sower',
    author: 'Octavia E. Butler',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBLPf2RHnOKWg_3qrv5JwoI61RMeqeCy7XmlvRiFVU7DlCVJpG9ZI1B-hAgtOavglapw-BOOq1erokvVPCzQR86IQqstuwvX0GtTK-s-JYS1tBk1ZO3TL-8U_qJuLPIVjfHj8bQFEBCvUSedf8u_DML6BXi-tyPqpq0HaGUt7WIcHZRDPW39lKhZpqpVbUw8inTneoBJWdS9lqsaGBFCW_BeTAHtXCuGAIHPImgZcvZaeZiyxcWqtrhIcextgOkDC6t7bgi9DnHvnAs',
    status: 'Reading',
    year: '1993'
  },
  {
    id: 'ancillary-justice',
    title: 'Ancillary Justice',
    author: 'Ann Leckie',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-0oUDhnHX2JG1pSxY6qXu6G4hpSZ6uq1zVEBmNSs7HG7-2F9Mkz0E2UJqNWKG8hsPxNwfntL5qGg3h1G3_Y6Jk5YnUDeUHgRmI6V1GdokNU9O1h18CG64x5qqHGeHS_A4s_ceWsEGF1Q9BCvNPTC_XdaeC0F1g-r5wwHn0P8bAFXVZt7okIymjemzJc7o9nmro2nJb7flO5RnScaC0aO2ILJnl8Q1xkx3GDieJw_-1hALBN-oqIoc_DeTMYk3aobzHEc9ixatMJay',
    status: 'To Read',
    year: '2013'
  },
  {
    id: 'gideon-ninth',
    title: 'Gideon the Ninth',
    author: 'Tamsyn Muir',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC4mjqCB9sBkuyDcVOLZJjdz6l_IdHTquSQEM3ndFsiZ3Mpt2yR_RngEvHJydMfIwYR_EX1LZgS7lpvuoPhj6IC3VeLdLap1ixmBZv0rpdXuvjXb8W_kf2snF_V5KQy3kgbNRH7WjuR3t9VeQrqy-SbLiAyfdZ9jEGFbpXQLKKQ8kSn3AMEyft8RzLaEDjFlVXhMOTramlNq-JSpfWMv8-CWNDFSjZ-DDygxH5L-XIR7QAxe2gGh1wdo9XMK2KX5xgM24upZyZ6-50d',
    status: 'Read',
    year: '2019'
  },
  {
    id: 'time-war',
    title: 'This Is How You Lose the Time War',
    author: 'Amal El-Mohtar & Max Gladstone',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCV-1ZVRwjQChR8P9AMgf9x9Tj3oKN_O-fyHuy5soTanJsc4XDSb78nQ02teCcicehzVlQg64dTPhEhx4sv4P6J6WL4BMuVxm0VC3ygj-F2uF60jICwwc5M3WUNf2pvfw_exj2JA0EncZ10pw44E45WZMssQFAIGsGypwg6Jth4JKXfMDDVcsvbiuwLsaN_GKQdpw3t98QnNyt4EnmhT0rp6mX6hUyR7RR04BcVAwCPOPF69nWLTzWO5HPI7lRGBZwCmBKU9JxAIJuw',
    status: 'To Read',
    year: '2019'
  },
  {
      id: 'pride-prejudice',
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      year: '1813',
      status: 'To Read',
      coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzCM1PUWsh3BssHvExN5vDNjuwMibVpHi9amtW6ZXKtWbkZ6PqaiXbgdXfNVzLMu12ohlxAGPjci_GLPlAz-O7Fkxv9WzbBXCtdS1zjIg5gH7WoDUEAFXV8xnccMi_pe66R-b6oB0GTWDb_mLwUjuDiUdu0GeMgTp2LFyGmLeOGkgx8irCuMW8Myw9kE_GzAhHAeqYMnwwx_6ajv-yEUwIxzq3t2AWSIY6J3MsSsd_5WSbd06JZItiBl5yfLMI5kbVkcryvs-g8MsA'
  },
  {
      id: 'sense-sensibility',
      title: 'Sense and Sensibility',
      author: 'Jane Austen',
      year: '1811',
      status: 'To Read',
      coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFDudqOMa-yAis8Mexb3CvrpFSskr5vrgCX5770YMgG5fX75JUHlPNRaulv5DuE95xReABLoTOkQVm6z9bXdbFh1vF_wkwcaF_l9HCmDUGJmMwkIUWV_9DM6RgJQNodu8EBSgbV2T8y0EtDqRma4LnzMaEMaQP1TJhSNDSx2oCuEUlLCfmPqC_3bJ7c-qg34LstT8eeshrGxH23xKDipli6SlvYBBKx8RFAn_FdN10nvvZaIdAIIgSlDB2lvsOV9HMGNRnq2H_raX-'
  },
  {
      id: 'emma',
      title: 'Emma',
      author: 'Jane Austen',
      year: '1815',
      status: 'To Read',
      coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEM4l37XcARvJ3U3ueymVFv_QuKSoAlpUuOQO_sP40i7mPqfJNDEDinwbzVjyo0ivLIwviOPJrDDstA3tgjkAuYujqdL66lkp43q8R6tL5RKxFUZoKZdz9-YqtZCzVQBvzUcWO7BvYTJ6jow-UJB9afAMmvLHswD73LXJOEZ1WZB8d-TlXrwc-NcYuqI7FjFV0Exb70h4qS8gpGI9vdgoqLTeRDG2SaK8PFOc8MeeuP6Mt-Odt9m_xwRMzOC1TZ1UJGf-llby0QUuu'
  },
  {
    id: 'last-man',
    title: 'The Last Man',
    author: 'Mary Shelley',
    year: '1826',
    status: 'To Read',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC13QwBVM5xF-CXD1MaX8qTmSwu7sgLRImXt4Gu-JqMdNz058xVDkXQt-3fNrYb-FF3-8NTPN5Fu9IFGIEjPCZoluRA1S3zx-rqi9W4POFYn3Qlb1XD8FOSeRlJiFP5shNpI38p1HFrATGurp5y6UhNTbNiWWpAT-wLpbavcMDls3Dy2gLiy0bKvEIz9zdV_MzwUS4tdZxM25jGOjsUFpTST-zD2GxL7pCP3_QKeR8Ljw04FWPoqIMml-X-hVMGppAJ_Cjjk_5lyvlk'
  },
  {
      id: 'lodore',
      title: 'Lodore',
      author: 'Mary Shelley',
      year: '1835',
      status: 'To Read',
      coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMpMsyVvMWDmHKYceCvSKfc6s7VY3qnkitgiWIHD4TrrFnt3Z1fRYSAkLAlWAbZPrj1vL7r0lUu00RRmBvie4iLPNUGaJGv3DkMkZNLff-CnpOLki3zLiudvF3KRrUsaAsqRq9NzGGJsIZp7pH1sCv-I1KYD8aOvt6CqlgVRCMhR2LDHJ-2mvW2NmCV_aoDH3jqAufoj52h_8ZkyJjsG9F728-s5hjac4_PxdDk5iYiDcC29DASkJA7IvFr1KieIxR3OlQpHp3-hK4'
  },
  {
      id: 'falkner',
      title: 'Falkner',
      author: 'Mary Shelley',
      year: '1837',
      status: 'To Read',
      coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArtcEi0_e-wkrlvD3d5U2Jebva1nMuHT_bMvuxiD9Ktk1Qaw2LXFUmLXxfpCWA1sCxdsMFYGRkIwIYMyY2DSMhBAzBo2eHG09DLuhHr82S2xW4DvQRBoz85raZhhyLQ4Nm7yndiXwrzgVVUw0zs97nHN5L8QCtuSIrcssh5WxKmbctqgoP1aja-iLxVkG6r7vGkiVjz6XDIINmso_aRI_77zQfV-k6SiFJer1e9EdQV8h_pne9SEYtk65hMNJMC8kSItx5E3aiTdhH'
  },
  {
      id: 'dune',
      title: 'Dune',
      author: 'Frank Herbert',
      year: '1965',
      status: 'Read',
      coverUrl: 'https://picsum.photos/seed/dune/300/400'
  },
  {
      id: 'earthsea',
      title: 'A Wizard of Earthsea',
      author: 'Ursula K. Le Guin',
      year: '1968',
      status: 'Read',
      coverUrl: 'https://picsum.photos/seed/earthsea/300/400'
  },
    {
      id: 'hail-mary',
      title: 'Project Hail Mary',
      author: 'Andy Weir',
      year: '2021',
      status: 'Read',
      coverUrl: 'https://picsum.photos/seed/hailmary/300/400'
  }
];

export const AUTHORS: Author[] = [
  {
    id: 'jane-austen',
    name: 'Jane Austen',
    years: '1775-1817',
    description: 'For lovers of social commentary.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHLsMieyoj0ip8d830fq7n3W6w3vrcYljL7YiFRn1LAd8uWKHqGgNLhFMn2o264e1DyoEheHpzGVfKsPt0-GpdttmiShZm6gQEhY1XZ1Cmj5TsvRxjYAR0KROOk-vFYdcV-pIRAnITUAxsrMWTSljw9RcWS22BOlxSTW4suQWObYa_jmA7CnS4fsqdT-GYh5QEiGW5qQCul051-b5L9nMiDgX9WIBPcRroMDfrwC-e6huDQMSAn18RBOvbPD47SkKrnYJQcRyVZLLg',
    books: BOOKS.filter(b => b.author === 'Jane Austen')
  },
  {
    id: 'mary-shelley',
    name: 'Mary Shelley',
    years: '1797-1851',
    description: 'For its exploration of human ambition.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxy7gY59ExPbgnGNuW-FHAJiF4npmM4Amnu8goBeOL5pi0Qb4rDNyniflIZwXW8kIyBgNwo-LrEZRFyGLZtn_3QSeTNQCTZJgRlUb2qlF1NJnZOCVgQFCFQUGl0RptSxSWQ98mYWNsxF80dtci3aBGCh2dDtATS_YbModnqpkVbMH7AmcBKFfiCsmtsCTLZoRJKcM6l4opuOZLl6bi41OXyU0X38nfL2YkxbYUKEl99l2j-bBhxxL4T5jwXIH9MvjN4sxnMgRC0QEk',
    books: BOOKS.filter(b => b.author === 'Mary Shelley')
  }
];