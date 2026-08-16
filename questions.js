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
    questionImage: "",
    choices: [
        {type:"text", value:"VPN Gateway"},
        {type:"text", value:"VNet Peering"},
        {type:"text", value:"Load Balancer"},
        {type:"text", value:"NSG"}
    ],
    answer: "VNet Peering",
    explanation: "Azure Virtual Network Peering を使用します。",
    explanationImage: ""
},

{
    id: 2,
    category: "ネットワーク",
    subCategory: "TCP/IP",
    difficulty: 1,
    tags: [
        "基礎"
    ],
    question: "HTTPのデフォルトポート番号は？",
    questionImage: "images/http-question.png",
    choices: [
        {type:"text", value:"80"},
        {type:"text", value:"443"},
        {type:"text", value:"22"},
        {type:"text", value:"21"}
    ],
    answer: "80",
    explanation: "HTTPはTCP80番ポートを使用します。",
    explanationImage: "images/http-port.png"
},

{
    id: 3,
    category: "ネットワーク",
    subCategory: "機器",
    difficulty: 2,
    tags: [
        "画像問題"
    ],
    question: "Routerはどれですか？",
    questionImage: "",
    choices: [
        {type:"image", value:"images/router1.png"},
        {type:"image", value:"images/router2.png"},
        {type:"image", value:"images/router3.png"},
        {type:"image", value:"images/router4.png"}
    ],
    answer: "images/router2.png",
    explanation: "Routerのアイコンは選択肢2です。",
    explanationImage: "images/router-answer.png"
}

];
