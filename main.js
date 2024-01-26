class Bubble{
    //1 bong bóng có 8vh, 8vw
    src = "./asset/bubble.png";
    alt = "#";
    class = "imgBub";
    content = "t";
    left = 0;
    constructor(t, left){
        this.content = t;
        this.left = left;
    };
    addBubble(){
        //phần tử mới
        var newElementBubble = document.createElement("div");
        newElementBubble.className = "eleBub";
        newElementBubble.style.left = `${this.left}vw`;
        //hình ảnh
        var newImgBubble = document.createElement("img");
        newImgBubble.src = this.src;
        newImgBubble.alt = this.alt;
        newImgBubble.style.width = `${this.width}vw`;
        newImgBubble.className = this.class;
        newElementBubble.appendChild(newImgBubble);

        //văn bản
        var newTextBubble = document.createElement("div");
        newTextBubble.textContent = this.content;
        newTextBubble.className = "textBub";
        newElementBubble.appendChild(newTextBubble);
        
        
        document.getElementById("mainGame").appendChild(newElementBubble);
        
        
    }
}


//main
//không thể cho tự động chơi ntn đc: 
/*playBackgroundSound();*/
var isPlaySound = false;

//hàm lấy dữ liệu từ data.json
async function getWords() {
    const response = await fetch("./hiragana.json");
    return await response.json(); // trả về 1 promise nên phải dùng .then để truy cập
}

var wordMap = [];   //các từ đang có trong màn hình
var bubbleArr = [];    //các bong bóng có trong màn hình
var score = 0;      //tính điểm
//lấy data để đưa vào bong bóng 
const data = getWords();
data.then((d)=>{
    //dữ liệu đã ở dạng mảng, bây giờ truy cập và hiển thị ngay trong .then
    const arr = Object.entries(d);
    //ready
    document.getElementById("ready").onclick =function(){
        document.getElementById("ready").style.display = "none";
        document.getElementById("input").style.display = "block";
        document.getElementById("score").style.display = "block";
        document.getElementById("best").style.display = "block";
        document.getElementById("best").textContent = "BEST: " + ((localStorage.getItem("bestScore") == null)?0:localStorage.getItem("bestScore"));
        //vòng lặp chính
        let count = 0;
        const mainInterval = setInterval(()=>{
            //phải để play sound ở đây
            // if(!isPlaySound){
            //     playBackgroundSound();
            //     console.log("hehe");
            //     isPlaySound = true;
            // }
            count++; 
            /*add bong bóng vào màn hình với tần số thấp */
            if(count %30 == 0){
                var indexWord = Math.floor(Math.random()*arr.length);
                var left = Math.random() *(90);
                var bubble1 = new Bubble(arr[indexWord][0], left);
                bubble1.addBubble();
                wordMap.push(arr[indexWord]);
            }
            
            //lấy dữ liệu từ ô input với tần số cao
            var inputBox = document.querySelector("#inputBox");
            inputBox.addEventListener("keydown", checkData);
            
            /*hình ảnh*/
            //lấy tất cả những phần tử bubble
            bubbleArr = document.querySelectorAll(".eleBub");
            //kiểm tra gameOver với tần số cao
            for(var i=0;i<bubbleArr.length;i++){
                if(bubbleArr[i].offsetTop == 0){
                    inputBox.removeEventListener("keydown", checkData);
                    console.log("game over");
                    playLoseSound();
                    document.querySelector("#gameOver").style.display = "block";
                    document.getElementById("mainDisplay").style.animation = "fade 1s linear";
                    document.getElementById("mainDisplay").style.backgroundImage = "url(\"./asset/loser.jpg\")";
                    var bestScore = (score>localStorage.getItem("bestScore"))?score:localStorage.getItem("bestScore");
                    localStorage.setItem("bestScore", bestScore);
                    document.getElementById("best").textContent = "BEST: " + localStorage.getItem("bestScore");
                    document.getElementById("input").style.display = "none";
                    setTimeout(()=>{
                        document.getElementById("replay").style.display = "block";
                    }, 2000);
                    clearInterval(mainInterval);
                }
            }
        }, 100);
    }
})

//kiểm tra data 
function checkData(event){
    if(event.key === "Enter"){
        inputWord = inputBox.value;
        //so khớp
        var isFound = false;
        wordMap.forEach((eachArr)=>{
            if(eachArr[1] == inputWord){
                //tìm thấy bong bóng cần xoá
                for(var i=0;i<bubbleArr.length;i++){
                    if(bubbleArr[i].innerText == eachArr[0]){
                        eraseElement(bubbleArr[i]);
                        playPopSound();
                        isFound = true;
                    }
                }
            }
        })
        if(isFound){
            setTrueAnswer();
            score ++;
            document.getElementById("score").textContent = "SCORE: " + score;
        }else{
            setFalseAnswer();
        }
        document.getElementById("inputBox").value = "";
    }
}

function eraseElement(b1){
    console.log(b1);
    delete(b1);
    b1.remove();
}
function playPopSound(){
    var sound = document.createElement("audio");
    sound.src = "./asset/pop.mp3";
    sound.play();
}
function playLoseSound(){
    var sound = document.createElement("audio");
    sound.src = "./asset/lose.mp3";
    sound.play();
}
function playWrongSound(){
    var sound = document.createElement("audio");
    sound.src = "./asset/wrong.mp3";
    sound.play();
}
function playBackgroundSound(){
    var sound = document.createElement("audio");
    sound.src = "./asset/luffys_pace.mp3";
    sound.play();
}
//thay đổi result
function setTrueAnswer(){
    var a = document.getElementById("result");
    a.style.backgroundColor = "green";
    a.innerText = "TRUE!";
}
function setFalseAnswer(){
    var a = document.getElementById("result");
    a.style.backgroundColor = "red";
    a.innerText = "FALSE!";
}

//hóng sự kiện chơi lại
document.getElementById("replay").addEventListener("click", function(){
    window.location.href = ("index.html");
})

