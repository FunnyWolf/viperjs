import React from 'react';
import { Link } from 'umi';
import Exception from '@/components/Exception';
import { formatMessage } from 'umi';
export default () => (
  <Exception
    type="404"
    linkElement={Link}
    desc={formatMessage({ id: 'app.exception.description.404' })}
    backText={formatMessage({ id: 'app.exception.back' })}
  />
);
