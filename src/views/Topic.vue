<script>

export default {
    data() {
        return {
            optionAmount: [1], // 選項 Input
            questionAmount: 1,// 問題區塊
            questionnaireContentList: [
                {
                    question: "",
                    options: "",
                    necessary: 0,
                    type: "",
                    questionnaire: {
                        id: sessionStorage.getItem("id")
                    }
                }
            ],
            
        }
    },
    created() {
        this.$watch('inputType', this.handleInputTypeChange, {deep: true});
    },
    methods: {
        plusQuestionAmount(item) {
            const questionnaire = {
                question: "",
                options: "",
                necessary: 0,
                type: "",
                questionnaire: {
                    id: sessionStorage.getItem("id")
                }
            }
            this.questionnaireContentList.push(questionnaire);
            this.optionAmount.push(1);
            item++;
            return item;
        },
        
        
        minusQuestionAmount(item) {
            item--;
            if (item <= 0) {
                return item = 1;
            }
            return item;
        },
        
        
        plusOptionAmount(item) {
            item++;
            return item;
        },
        
        
        minusOptionAmount(item) {
            item--;
            if (item <= 0) {
                return item = 1;
            }
            return item;
        },
        
        
        // 僅使用在 Watch
        getChangedIndex(newArray, oldArray) {
            for (let i = 0; i < newArray.length; i++) {
                if (newArray[i] !== oldArray[i]) {
                    return i;
                }
            }
            return -1;
        },
        
        
        handleInputTypeChange(newArray, oldArray) {
            for (let i = 0; i < newArray.length; i++) {
                if (newArray[i] !== oldArray[i]) {
                    console.log(`inputType[${i}] 發生變動，新值為 ${newArray[i]}`);
                }
            }
        },
        
        
        show() {
            console.log(this.questionnaireContentList)
        }
    },
    mounted() {
    },
}
</script>

<template>
    <div class="topic">
        <div v-for="(n,index) in questionAmount" :key="index" class="question-block">
            
            <!--  我是問題題目  -->
            <label :for="'question-' + index">問題</label>
            <input :id="`question-` + index" v-model="questionnaireContentList[index].question" type="text">
            
            <!--  是否必須  -->
            <label :for="'necessary-' + index">必須</label>
            <input :id="'necessary-' + index" v-model="questionnaireContentList[index].necessary" type="checkbox">
            
            
            <!--  我是加加、減減  -->
            <span v-if="questionnaireContentList[index].type !== 'text'"
                  @click="optionAmount[index] = plusOptionAmount(optionAmount[index])">＋</span>
            <span v-if="questionnaireContentList[index].type !== 'text'"
                  @click="optionAmount[index] = minusOptionAmount(optionAmount[index])">－</span>
            
            <!--  我是問題內容  -->
            <div class="option-block">
                <label for="answer">回答</label>
                <input v-for=" (n,index) in optionAmount[index]" :key="index" type="text">
            </div>
            
            <!--  我是問題類型  -->
            <select v-model="questionnaireContentList[index].type">
                <option value="text">
                    簡答
                </option>
                <option value="select">
                    選擇題
                </option>
                <option value="checkbox">
                    核取方塊
                </option>
            </select>
        
        </div>
        
        <!--  我是加加、減減  -->
        <div class="symbol">
            <span @click="questionAmount = plusQuestionAmount(questionAmount)">＋</span>
            <span @click="questionAmount = minusQuestionAmount(questionAmount)">－</span>
        </div>
    </div>
    <button @click="show">Console</button>
</template>

<style lang="scss" scoped>
.topic {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
    .question-block {
        
        .option-block {
            display: flex;
            flex-direction: column;
        }
    }
}
</style>