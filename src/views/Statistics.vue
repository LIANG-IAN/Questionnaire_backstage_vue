<script>
import Chart from 'chart.js/auto';
import axios from "axios";
import {Colors} from 'chart.js';

Chart.register(Colors);
Chart.defaults.color = 'white';
Chart.defaults.font.size = '14';

export default {
    data() {
        return {
            id: "",// Questionnaire 的 id
            questionnaireContentList: [],// 這題所有題目與選項
            answerContentList: [],// 所有答這題的人的答案
            
            
            findAllByQuestionnaireId: import.meta.env.VITE_FIND_ALL_BY_QUESTIONNAIRE_ID,
            findByQuestionnaireIdFromAnswerContent: import.meta.env.VITE_FIND_BY_QUESTIONNAIRE_ID_FROM_ANSWER_CONTENT,
        }
    },
    mounted: async function () {
        this.id = sessionStorage.getItem("id");
        
        // 一坨拉庫的非同步操作
        const questionnaireContentResponse = await axios.post(this.findAllByQuestionnaireId, {"questionnaireId": this.id});
        const answerContentResponse = await axios.post(this.findByQuestionnaireIdFromAnswerContent, {"questionnaireId": this.id});
        await Promise.all([questionnaireContentResponse, answerContentResponse]);
        this.questionnaireContentList = questionnaireContentResponse.data.questionnaireContentList;
        this.answerContentList = answerContentResponse.data.answerContentList;
        
        await this.$nextTick(() => { // v-for 太慢，document.querySelectorAll會抓不到
            this.makeChart("pie");
        });
    },
    methods: {
        makeChart(type) {
            const chartArr = document.querySelectorAll(".chart");
            
            for (let i = 0; i < this.questionnaireContentList.length; i++) {
                if (this.questionnaireContentList[i].type === "text"){
                    continue;
                }
                const options = this.questionnaireContentList[i].options.split(";")
                const id = this.questionnaireContentList[i].id;
                const filteredList = this.answerContentList.filter((item) => item.questionnaireContent.id === id);
                const newArray = filteredList.map((item) => item.answer);
                
                const temp = newArray.flatMap(item => item.split(';'));
                console.log(temp)
                const result = options.reduce((accumulator, currentValue) => {
                    const count = temp.filter((item) => item === currentValue).length;
                    accumulator.push(count);
                    return accumulator;
                }, []);
                (function() {
                    new Chart(chartArr[i], {
                        type: type,
                        data: {
                            labels: options,
                            datasets: [
                                {
                                    data: result,
                                },
                            ],
                        },
                        options: {
                            plugins: {
                                colors: {
                                    forceOverride: true, // 強制使用 Char.js 提供的顏色
                                },
                                title: {
                                    display: true,
                                    text: this.questionnaireContentList[i].question,
                                },
                            },
                            responsive: true,
                        },
                    });
                }).call(this);
            }
        }
        
    }
}
</script>

<template>
    <div class="statistics">
        <div v-for="(content,index) in questionnaireContentList" :key="index" class="chart-block" :class="[index % 2 === 0? 'align-self-left' : 'align-self-right']">
            <canvas class="chart"></canvas>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.statistics {
    height: 600px;
    overflow: auto;
    padding: 10px 0 10px 10px;
    display: flex;
    flex-direction: column;
    
    .chart-block {
        width: 400px;
    }
}

// 左右交錯用 class
.align-self-left {
    align-self: start;
}

.align-self-right {
    align-self: end;
}
</style>