import { useState, useCallback, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { cx } from '@emotion/css';
import { Box, Button, Input, Stack, Text } from '@stacks/ui';

import { useRouteHeader } from '@app/common/hooks/use-route-header';
import { useWallet } from '@app/common/hooks/use-wallet';
import { useDrawers } from '@app/common/hooks/use-drawers';
import { buildEnterKeyEvent } from '@app/components/link';
import { ErrorLabel } from '@app/components/error-label';
import { Header } from '@app/components/header';
import { Title } from '@app/components/typography';
import { SignOutConfirmDrawer } from '@app/pages/sign-out-confirm/sign-out-confirm';
import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { useOnboardingState } from '@app/common/hooks/auth/use-onboarding-state';
import { isFullPage, isPopup } from '@app/common/utils';
import { Caption } from '@app/components/typography';
import { useWaitingMessage, WaitingMessages } from '@app/common/utils/use-waiting-message';
import { fullPageContent, fullPageTitle, popupPageTitle } from '@app/pages/pages.styles';
import { RouteUrls } from '@shared/route-urls';
import { OnboardingSelectors } from '@tests/integration/onboarding.selectors';

const waitingMessages: WaitingMessages = {
  '2': 'Please wait a few seconds…',
  '10': 'Still working, please wait.',
  '20': 'Almost there.',
};

export function Unlock(): JSX.Element {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { unlockWallet } = useWallet();
  const { decodedAuthRequest } = useOnboardingState();
  const { showSignOut } = useDrawers();
  const analytics = useAnalytics();
  const navigate = useNavigate();
  const [waitingMessage, startWaitingMessage, stopWaitingMessage] =
    useWaitingMessage(waitingMessages);

  useRouteHeader(<Header />);

  const submit = useCallback(async () => {
    const startUnlockTimeMs = performance.now();
    void analytics.track('start_unlock');
    setLoading(true);
    startWaitingMessage();
    setError('');
    try {
      await unlockWallet(password);

      if (decodedAuthRequest) {
        navigate(RouteUrls.ChooseAccount);
      } else {
        navigate(RouteUrls.Home);
      }
    } catch (error) {
      setError('The password you entered is invalid.');
    }
    setLoading(false);
    stopWaitingMessage();
    const unlockSuccessTimeMs = performance.now();
    void analytics.track('complete_unlock', {
      durationMs: unlockSuccessTimeMs - startUnlockTimeMs,
    });
  }, [
    startWaitingMessage,
    analytics,
    stopWaitingMessage,
    unlockWallet,
    password,
    decodedAuthRequest,
    navigate,
  ]);

  return (
    <Stack className={isFullPage ? fullPageContent : undefined} spacing="loose" width="100%">
      <Title
        className={cx({ [fullPageTitle]: isFullPage }, { [popupPageTitle]: isPopup })}
        fontWeight={500}
      >
        Unlock
      </Title>
      <Caption textAlign={isFullPage ? 'center' : 'left'}>
        {waitingMessage || 'Enter the password you used on this device.'}
      </Caption>
      <Input
        autoFocus
        borderRadius="10px"
        data-testid={OnboardingSelectors.SetOrEnterPasswordInput}
        height="64px"
        isDisabled={loading}
        onChange={(e: FormEvent<HTMLInputElement>) => setPassword(e.currentTarget.value)}
        onKeyUp={buildEnterKeyEvent(submit)}
        placeholder="Enter your password"
        type="password"
        value={password}
        width="100%"
      />
      {error && (
        <Box>
          <ErrorLabel>
            <Text textStyle="caption">{error}</Text>
          </ErrorLabel>
        </Box>
      )}
      <Button
        borderRadius="10px"
        data-testid="set-password-done"
        height="48px"
        isLoading={loading}
        isDisabled={loading}
        onClick={submit}
        width="100%"
      >
        Unlock
      </Button>
      {showSignOut && <SignOutConfirmDrawer />}
    </Stack>
  );
}