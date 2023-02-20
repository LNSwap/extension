import toast from 'react-hot-toast';
import { FiArrowUpRight } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';

import { Box, Stack, color, useClipboard } from '@stacks/ui';

import { useAnalytics } from '@app/common/hooks/analytics/use-analytics';
import { openInNewTab } from '@app/common/utils/open-in-new-tab';
import { BaseDrawer } from '@app/components/drawer/base-drawer';
import { ErrorLabel } from '@app/components/error-label';
import { OrdinalIcon } from '@app/components/icons/ordinal-icon';
import { Divider } from '@app/components/layout/divider';
import { PrimaryButton } from '@app/components/primary-button';
import { Text, Title } from '@app/components/typography';

export function ReceiveCollectibleOrdinal() {
  const navigate = useNavigate();
  const analytics = useAnalytics();
  const { state } = useLocation();
  const { onCopy } = useClipboard(state.btcAddress);

  function copyToClipboard() {
    void analytics.track('copy_address_to_add_new_inscription');
    toast.success('Copied to clipboard!');
    onCopy();
  }

  return (
    <BaseDrawer isShowing onClose={() => navigate('../')}>
      <Box mx="extra-loose">
        <Stack alignItems="center" px={['unset', 'base']} spacing="loose" textAlign="center">
          <OrdinalIcon />
          <Title fontSize="20px" lineHeight="28px" px="extra-loose">
            Deposit Ordinal inscription
          </Title>
          <Text color={color('text-title')} fontSize={1} px={['50px', '70px']}>
            Use your wallet to create inscriptions within minutes on
          </Text>
          <Stack alignItems="center" pb={['unset', 'base']}>
            <Stack
              _hover={{ cursor: 'pointer' }}
              alignItems="center"
              as="button"
              color={color('accent')}
              fontSize={1}
              isInline
              onClick={() => openInNewTab('https://gamma.io/')}
              spacing="extra-tight"
              textDecoration="underline"
              type="button"
            >
              <Text color="inherit">Gamma.io</Text>
              <FiArrowUpRight />
            </Stack>
            <Stack
              _hover={{ cursor: 'pointer' }}
              alignItems="center"
              as="button"
              color={color('accent')}
              fontSize={1}
              isInline
              onClick={() => openInNewTab('https://ordinalsbot.com/')}
              spacing="extra-tight"
              textDecoration="underline"
              type="button"
            >
              <Text color="inherit">ordinalsbot.com</Text>
              <FiArrowUpRight />
            </Stack>
          </Stack>
          <Divider />
          <ErrorLabel mt={['unset', 'base']}>Important to keep in mind</ErrorLabel>
          <Text color={color('text-title')} fontSize={1} px={['unset', 'loose']}>
            This Taproot address is for Ordinals only. Do not deposit other BTC here or you may have
            difficulty retrieving it
          </Text>
        </Stack>
        <PrimaryButton flexGrow={1} my="extra-loose" onClick={copyToClipboard} width="100%">
          Copy address
        </PrimaryButton>
      </Box>
    </BaseDrawer>
  );
}