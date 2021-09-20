import React, { useState } from "react";
import {
  Box,
  Button,
  CssBaseline,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { SubtitleDropzone } from "app/SubtitleDropzone";
import { ThemeProvider } from "app/ThemeProvider";
import DownloadIcon from "@mui/icons-material/Download";
import ClearIcon from "@mui/icons-material/Clear";
import { download, prolongSubtitles } from "app/subtitles";

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [time, setTime] = useState(500);

  return (
    <ThemeProvider>
      <CssBaseline />
      <Box
        sx={{
          my: 3,
          mx: "auto",
          maxWidth: 600,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h2" align="center" mb={3} component="h1">
          Subtitle Editor
        </Typography>
        <SubtitleDropzone files={files} onDrop={(files) => setFiles(files)} />
        <Box my={2}>
          {files.length > 0 && `Uploaded ${files.length} files.`}
        </Box>
        <TextField
          value={time}
          onChange={(e) => setTime(parseInt(e.target.value, 10))}
          inputProps={{ step: 50 }}
          label="Prolonged time"
          helperText="Prolong the subtitle text for an amount of time in milliseconds"
          type="number"
          sx={{ mb: 2 }}
        />
        <Stack direction="row" gap={2}>
          <Button
            fullWidth
            startIcon={<ClearIcon />}
            variant="outlined"
            onClick={() => setFiles([])}
          >
            CLEAR
          </Button>
          <Button
            fullWidth
            startIcon={<DownloadIcon />}
            variant="contained"
            disabled={files.length === 0}
            onClick={async () => {
              const results = await prolongSubtitles(files, time);
              await download(results);
            }}
          >
            DOWNLOAD
          </Button>
        </Stack>
      </Box>
    </ThemeProvider>
  );
}

export default App;
