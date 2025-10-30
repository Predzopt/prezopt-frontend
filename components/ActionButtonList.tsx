'use client';
import {
  useDisconnect,
  useAppKit,
  useAppKitNetwork,
  useAppKitAccount,
} from '@reown/appkit/react';
import { networks } from '@/config';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

export const ActionButtonList = () => {
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  const { switchNetwork } = useAppKitNetwork();
  const { isConnected } = useAppKitAccount();

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };
  return (
    <div className="flex gap-3">
      {isConnected ? (
        <appkit-button />
      ) : (
        <Button
          onClick={() => open()}
          variant="outline"
          className="h-11 rounded-[10px] px-4 py-3.5 text-white opacity-100 shadow-[inset_0_0.6px_0.6px_-1.58px_rgba(255,255,255,0.894),inset_0_2.28px_2.28px_-3.16px_rgba(255,255,255,0.745),inset_0_10px_10px_-4.75px_rgba(255,255,255,0.05)] backdrop-blur-[5px] duration-300 will-change-auto [background:linear-gradient(rgba(28,28,28,0.1)_0%,rgba(18,18,18,0.2)_100%)_rgba(0,0,0,0)] hover:text-white"
        >
          Connect
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}

      {/* <button
        className="cursor-pointer bg-purple-500 text-white"
        onClick={handleDisconnect}
      >
        Disconnect
      </button> */}
      {/* <button
        className="cursor-pointer bg-purple-500 text-white"
        onClick={() => switchNetwork(networks[1])}
      >
        Switch
      </button> */}
    </div>
  );
};
