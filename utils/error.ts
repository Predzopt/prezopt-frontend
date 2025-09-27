export async function safeContractCall(contractCall: () => Promise<any>) {
  try {
    return await contractCall();
  } catch (error: any) {
    console.error('Contract call error:', error);

    if (error.code === 4001) {
      throw new Error('Transaction rejected by user');
    } else if (error.code === -32603) {
      throw new Error(
        'Internal JSON-RPC error - check your network connection'
      );
    } else if (error.code === -32601) {
      throw new Error(
        'Method not found - contract may not be deployed on this network'
      );
    } else if (error.code === -32000) {
      throw new Error('Insufficient funds for gas');
    } else if (error.message?.includes('execution reverted')) {
      throw new Error(`Transaction failed: ${error.message}`);
    } else if (error.message?.includes('network')) {
      throw new Error('Network error - please check your connection');
    } else {
      throw new Error(error.reason || error.message || 'Transaction failed');
    }
  }
}
