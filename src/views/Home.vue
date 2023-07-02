<script>

export default {
    methods: {
        identity(num) {
            if (num === 0) {
                sessionStorage.setItem("identity", "false");
            }
            else {
                sessionStorage.setItem("identity", "true");
            }
            this.$router.push("/Overview")
        }
    },
    mounted() {
        sessionStorage.clear();
        document.addEventListener('mousemove', (e) => {
            const eye2 = document.querySelector('.eye2');
            const pupil2 = document.querySelector('.pupil2');
            
            const eye1 = document.querySelector('.eye1');
            const pupil1 = document.querySelector('.pupil1');
            
            // 計算滑鼠在眼睛區域內的相對位置
            const eyeRect2 = eye2.getBoundingClientRect();
            const eyeRect1 = eye1.getBoundingClientRect();
            const mouseX2 = e.clientX - eyeRect2.left;
            const mouseY2 = e.clientY - eyeRect2.top;
            const mouseX1 = e.clientX - eyeRect1.left;
            const mouseY1 = e.clientY - eyeRect1.top;
            
            // 計算瞳孔應該偏移的距離
            const maxOffset = 10; // 瞳孔最大偏移距離
            const offsetX2 = Math.max(-maxOffset, Math.min(maxOffset, mouseX2 - eyeRect2.width / 2));
            const offsetY2 = Math.max(-maxOffset, Math.min(maxOffset, mouseY2 - eyeRect2.height / 2));
            const offsetX1 = Math.max(-maxOffset, Math.min(maxOffset, mouseX1 - eyeRect1.width / 2));
            const offsetY1 = Math.max(-maxOffset, Math.min(maxOffset, mouseY1 - eyeRect1.height / 2));
            
            // 設定瞳孔的偏移位置
            pupil2.style.transform = `translate(${offsetX2}px, ${offsetY2}px)`;
            pupil1.style.transform = `translate(${offsetX1}px, ${offsetY1}px)`;
        });
    }
}
</script>

<template>
    <div class="home">
        <div>
            <button @click="identity(0)">使用者</button>
            <button @click="identity(1)">管理員</button>
        </div>
        <div class="pinia">
            <img alt="" src="../../public/svg.svg">
        </div>
        <div class="control2">
            <div class="eye2">
                <div class="pupil2">
                    <div class="water1" >
                    </div>
                </div>
            </div>
        </div>
        <div class="control1">
            <div class="eye1">
                <div class="pupil1"><div class="water1" >
                </div></div>
            </div>
        </div>
        
    </div>
</template>

<style lang="scss" scoped>
.home {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    
    button {
        padding: 20px;
        margin: 20px;
    }
    
    .pinia{
        img{
            -webkit-filter: drop-shadow(10px 10px 4px #6c6c6c);
        }
    }
    
    .control2 {
        position: absolute;
        top: 360px;
        left: 190px;
    }
    
    .eye2 {
        position: relative;
        width: 50px;
        height: 50px;
        background-color: #ffffff;
        border-radius: 50%;
        overflow: hidden;
    }
    
    .pupil2 {
        position: absolute;
        width: 30px;
        height: 30px;
        background-color: black;
        border-radius: 50%;
        top: 20%;
        left: 20%;
        transform: translate(-50%, -50%);
    }
    
    .control1 {
        position: absolute;
        top: 355px;
        left: 58px;
    }
    
    .eye1 {
        position: relative;
        width: 50px;
        height: 50px;
        background-color: #ffffff;
        border-radius: 50%;
        overflow: hidden;
    }
    
    .pupil1 {
        position: absolute;
        width: 30px;
        height: 30px;
        background-color: black;
        border-radius: 50%;
        top: 20%;
        left: 20%;
        transform: translate(-50%, -50%);
    }
    
}

.water1{
    content: '';
    position: absolute;
    top: 25%;
    left: 25%;
    width: 13px;
    height: 13px;
    background-color: white;
    border-radius: 50%;
}

</style>