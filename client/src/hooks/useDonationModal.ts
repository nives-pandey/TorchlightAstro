import { useState, useEffect } from "react";

export interface DonationModalTrigger {
  type: 'chart_generated' | 'feature_used' | 'time_spent' | 'manual';
  delay?: number; // Delay before showing modal (in ms)
}

export function useDonationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [trigger, setTrigger] = useState<string | undefined>();

  // Track user interaction and show modal at appropriate times
  const showModal = (triggerType: DonationModalTrigger) => {
    // Don't show modal if user has contributed recently
    const lastContribution = localStorage.getItem('torchlight_last_contribution');
    if (lastContribution) {
      const lastDate = new Date(lastContribution);
      const daysSince = (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) return; // Don't show for a week after contribution
    }

    // Don't show modal if user dismissed it recently
    const lastDismissal = localStorage.getItem('torchlight_modal_dismissed');
    if (lastDismissal) {
      const lastDate = new Date(lastDismissal);
      const hoursSince = (Date.now() - lastDate.getTime()) / (1000 * 60 * 60);
      if (hoursSince < 24) return; // Don't show for 24 hours after dismissal
    }

    const showWithDelay = () => {
      setTrigger(triggerType.type);
      setIsOpen(true);
    };

    if (triggerType.delay) {
      setTimeout(showWithDelay, triggerType.delay);
    } else {
      showWithDelay();
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setTrigger(undefined);
    // Track dismissal to prevent showing too frequently
    localStorage.setItem('torchlight_modal_dismissed', new Date().toISOString());
  };

  // Track time spent on site and show modal after significant engagement
  useEffect(() => {
    const startTime = Date.now();
    const timeThreshold = 5 * 60 * 1000; // 5 minutes

    const handleBeforeUnload = () => {
      const timeSpent = Date.now() - startTime;
      if (timeSpent > timeThreshold) {
        localStorage.setItem('torchlight_engagement_time', timeSpent.toString());
      }
    };

    // Show modal after user spends significant time
    const timeoutId = setTimeout(() => {
      showModal({ type: 'time_spent' });
    }, timeThreshold);

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return {
    isOpen,
    trigger,
    showModal,
    closeModal
  };
}