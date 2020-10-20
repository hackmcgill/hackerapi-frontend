import { Box, Flex } from '@rebass/grid';
import * as React from 'react';

import { Button, IButtonProps } from '../Elements';

export const SubmitBtn: React.FC<
  IButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>
> = (props) => (
  <Flex justifyContent={'left'} mt={'50px'} mb={'50px'}>
    <Box>
      <Button type={'submit'} {...props}>
        {props.children}
      </Button>
    </Box>
  </Flex>
);
