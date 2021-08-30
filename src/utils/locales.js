import { useIntl } from 'umi';

const formatText = (id) => {
  return useIntl().formatMessage({ id });
};

export { formatText };
