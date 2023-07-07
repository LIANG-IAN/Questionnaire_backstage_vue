<script>
import axios from 'axios';

export default {
    data() {
        return {
            id: sessionStorage.getItem("id"),
            questionnaire: {
                questionnaire: "",
                mainPoint: "",
                startingTime: new Date().toISOString().substring(0, 10),
                endTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .substring(0, 10)
            },
            
            findByQuestionnaireId: import.meta.env.VITE_FIND_BY_QUESTIONNAIRE_ID,
            modifyQuestionnaire: import.meta.env.VITE_MODIFY_QUESTIONNAIRE,
            addQuestionnaire: import.meta.env.VITE_ADD_QUESTIONNAIRE
        }
    },
    mounted() {
        // 取得問卷並渲染
        if (this.id !== null) {
            axios.post(this.findByQuestionnaireId, {"id": this.id}).then(response => {
                this.questionnaire = response.data.questionnaire;
            });
        }
        
        // 取的緩存並渲染
        else {
            const storedQuestionnaire = sessionStorage.getItem("questionnaireObject");
            if (storedQuestionnaire) {
                this.questionnaire = JSON.parse(storedQuestionnaire);
            }
        }
    },
    methods: {
        // 更新
        update(questionnaire) {
            questionnaire.id = this.id;
            axios.post(this.modifyQuestionnaire, {questionnaire: questionnaire}).then(response => {
                alert(response.data.message);
            })
        },
        
        // 送出 (新增)
        send(questionnaire) {
            axios.post(this.addQuestionnaire, {questionnaire: questionnaire}).then(response => {
                alert(response.data.message);
                this.id = response.data.questionnaire.id;
                sessionStorage.setItem("id", this.id)
            })
        },
        
        //檢查結束時間
        checkEndTime(){
            if (this.questionnaire.endTime < new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
                .toISOString()
                .substring(0, 10)){
                this.questionnaire.endTime = null;
            }
           }
        
    },
    watch: {
        // 暫存
        questionnaire: {
            handler() {
                const temp = JSON.stringify(this.questionnaire);
                sessionStorage.setItem("questionnaireObject", temp);
            },
            deep: true
        }
    }
}
</script>

<template>
    <div class="questionnaire-manage">
        <div class="container">
            <div class="box">
                <label for="name">問卷名稱</label>
                <input id="name" v-model.trim="questionnaire.questionnaire" type="text">
            </div>
            
            <div class="box">
                <label for="content">描述內容</label>
                <input id="content" v-model.trim="questionnaire.mainPoint" type="text">
            </div>
            
            <div class="box">
                <label for="starting-time">開始時間</label>
                <input id="starting-time" v-model="questionnaire.startingTime" type="date">
            </div>
            
            <div class="box">
                <label for="end-time">結束時間</label>
                <input id="end-time" v-model="questionnaire.endTime" type="date" @blur="checkEndTime">
            </div>
        </div>
        
        
        <button v-if="this.id !== null" type="button" @click="update(questionnaire)">更新</button>
        <button v-else type="button" @click="send(questionnaire)">送出</button>
    </div>
</template>

<style lang="scss" scoped>
.questionnaire-manage {
    display: flex;
    flex-direction: column;
    height: 600px;
    
    button{
        width: 200px;
        margin-bottom: 50px;
        margin-left: 300px;
    }
    .container {
        display: flex;
        flex-direction: column;
        height: 100%;
        margin: 0 10px 0 30px;
        padding: 20px 0;
        
        .box{
        padding-bottom: 50px;
        }
    }
}
</style>