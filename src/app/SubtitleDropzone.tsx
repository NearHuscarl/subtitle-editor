import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { alpha, Box, Typography, useTheme } from "@mui/material";

const emptyText =
  "Drag and drop the folder containing the subtitle files here...";

type SubtitleDropzoneProps = {
  files: File[];
  onDrop?: (file: File[]) => void;
};

export function SubtitleDropzone(props: SubtitleDropzoneProps) {
  const theme = useTheme();
  const [text, setText] = useState(emptyText);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    // 1MB
    maxSize: 1024 * 1024,
    onDrop: (acceptedFiles) => {
      const subtitleFiles = acceptedFiles.filter((x) => x.name.endsWith("srt"));

      props.onDrop?.(subtitleFiles);
    },
  });
  const color = isDragActive
    ? theme.palette.primary.main
    : theme.palette.primary.light;

  useEffect(() => {
    const fileNames = props.files.map((x) => x.name).join(", ");
    setText(fileNames === "" ? emptyText : fileNames);
  }, [props.files]);

  return (
    <Box
      {...getRootProps()}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 150,
        backgroundColor: isDragActive
          ? alpha(theme.palette.primary.light, 0.2)
          : "transparent",
        padding: theme.spacing(2),
        border: `4px dashed ${color}`,
        borderRadius: theme.shape.borderRadius,
        color: color,
        transition: theme.transitions.create(["border", "background-color"], {
          duration: "0.24s",
          easing: "ease-in-out",
        }),
      }}
    >
      <input
        {...getInputProps()}
        // @ts-ignore
        webkitdirectory=""
        mozdirectory=""
        directory=""
      />
      <Typography style={{ wordWrap: "break-word", textAlign: "center" }}>
        {text}
      </Typography>
    </Box>
  );
}
