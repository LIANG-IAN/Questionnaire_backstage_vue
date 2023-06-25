import { defineStore } from 'pinia'

export const useStore = defineStore("store", {
    state() {
        return {
            searchQuestionnaireFuzzyResult: [],
        };
    },
    actions: {
        setQuestionnaireFuzzyResult(searchQuestionnaireFuzzyResult) {
            this.searchQuestionnaireFuzzyResult = searchQuestionnaireFuzzyResult;
        },
    },
});
