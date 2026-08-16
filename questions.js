const quizData = [

{
    id: 1,

    category: "Azure",
    subCategory: "Virtual Network",

    difficulty: 3,

    tags: [
        "AZ-104",
        "ネットワーク"
    ],

    question: "VNet同士を接続する機能は？",

    choices: [
        "VPN Gateway",
        "VNet Peering",
        "Load Balancer",
        "NSG"
    ],

    answer: "VNet Peering",

    explanation:
        "Azure Virtual Network Peering を使用します。",

    source:
        "Microsoft Learn",

    version:
        "2025"
},

{
    id: 2,

    category: "ネットワーク",
    subCategory: "TCP/IP",

    difficulty: 1,

    tags: [
        "基礎"
    ],

    question:
        "HTTPのデフォルトポート番号は？",

    choices: [
        "80",
        "443",
        "22",
        "21"
    ],

    answer:
        "80",

    explanation:
        "HTTPはTCP80番ポートを使用します。",

    source:
        "RFC",

    version:
        "2025"
},

{
    id: 3,

    category: "PowerShell",
    subCategory: "基本",

    difficulty: 2,

    tags: [
        "PowerShell"
    ],

    question:
        "現在のディレクトリを表示するコマンドは？",

    choices: [
        "pwd",
        "mkdir",
        "cls",
        "cd.."
    ],

    answer:
        "pwd",

    explanation:
        "pwd は Get-Location のエイリアスです。",

    source:
        "Microsoft",

    version:
        "2025"
}

];