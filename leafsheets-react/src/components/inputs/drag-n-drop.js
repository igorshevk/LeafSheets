// Imports

import {layout, space, flexbox, border} from 'styled-system';
import {useDropzone} from 'react-dropzone';
import {FaRegImage} from 'react-icons/fa';
import styled from 'styled-components';
import React from 'react';

import {FlexColumn} from '../layouts';
import {Icon} from '../icons';

// Sub Components

const DropzoneContainer = styled(FlexColumn)(
  {
    alignItems: 'center',
    backgroundColor: 'rgb(235,235,235)',
    borderRadius: '4px',
    border: '1px solid #b2bfc4 !important',
    cursor: 'pointer',
    justifyContent: 'center',
    outline: 'none',
    position: 'relative',
    '&:hover': {
      border: '1px solid #30E1A5 !important',
      outline: 'none',
    },
  },
  border,
  space,
  layout,
  flexbox
);

const DropzoneImage = styled.img(
  {
    borderRadius: 3,
    left: 0,
    position: 'absolute',
    top: 0,
  },
  space,
  layout
);

// Dropzone

function Dropzone({
  minSize,
  maxSize,
  handleDrop,
  kind,
  createMessage,
  returnErrors,
  image,
  saveImage,
  ...styleProps
}) {
  const {height, width} = styleProps;
  let adjustedHeight = parseInt(height) - 2;
  let adjustedWidth = parseInt(width) - 2;

  const {getRootProps, getInputProps} = useDropzone({
    accept: 'image/*',
    maxSize: maxSize,
    multiple: false,
    handleDrop: handleDrop,
    kind: kind,
    onDrop: acceptedFiles => {
      saveImage(acceptedFiles[0]);
    },
    onDropRejected: rejectedFiles => {
      const isFileTooLarge = rejectedFiles.length > 0 && rejectedFiles[0].size > maxSize;
      if (isFileTooLarge) {
        returnErrors({message: 'Your file is too big. Max file size is 5MB.'});
      }
    },
  });

  return (
    <>
      <DropzoneContainer {...styleProps} {...getRootProps()}>
        <input {...getInputProps()} />
        <Icon
          icon={[<FaRegImage />]}
          mt="4px"
          color={'normalGrey'}
          variant="mediumLarge"
        />
        {image !== null && (
          <DropzoneImage height={adjustedHeight} width={adjustedWidth} src={image} />
        )}
      </DropzoneContainer>
    </>
  );
}

export default Dropzone;
