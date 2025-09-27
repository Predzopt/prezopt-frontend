export async function safeContractCall(contractCall: () => Promise<any>) {
  try {
    return await contractCall();
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error("Transaction rejected by user");
    } else if (error.code === -32603) {
      throw new Error("Internal JSON-RPC error");
    } else {
      throw new Error(error.reason || error.message || "Transaction failed");
    }
  }
}