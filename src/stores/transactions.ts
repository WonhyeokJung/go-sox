import { defineStore } from "pinia";
import { Transactions } from "@/types";
import { Ref, computed, ref } from "vue";
import { $_getTransactions } from "@/api/get";

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions: Ref<Transactions | undefined> = ref()
  const getTransactions = computed(() => transactions.value)
  
  async function fetchTransactions(teamId:number, date?:string) {
    const { data } = await $_getTransactions(teamId, date)
    console.log(data)
    transactions.value = data;
  }

  return {
    getTransactions,
    fetchTransactions
  }
})