import { parse, addMilliseconds, format } from "date-fns";
import JSZip from "jszip";

const zip = new JSZip();

type SubtitleResult = {
  name: string;
  path: string;
  content: string;
};

const dateNow = new Date();
function getTimestamp(text: string) {
  return parse(text, "HH:mm:ss,SSS", dateNow);
}
function toTimestamp(date: Date) {
  return format(date, "HH:mm:ss,SSS");
}

export async function prolongSubtitles(
  files: File[],
  time: number
): Promise<SubtitleResult[]> {
  const resultFiles: File[] = [];

  return await Promise.all(
    files.map(async (f) => {
      const text = await f.text();
      const lines = text.split(/\r?\n/);
      const resultLines: string[] = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes("-->")) {
          const timeStamps = line.split("-->").map((t) => {
            const timestamp = getTimestamp(t.trim());
            const newTimestamp = addMilliseconds(timestamp, time);
            return toTimestamp(newTimestamp);
          }) as [string, string];

          resultLines.push(`${timeStamps[0]} --> ${timeStamps[1]}`);
        } else {
          resultLines.push(line);
        }
      }

      return {
        // '17.Turkish.srt' -> '17.Turkish.5500.srt'
        name: f.name.replace(/(^.*)(\..*)/, "$1." + time + "$2"),
        content: resultLines.join("\r\n"),
        path: (f as any).path,
      };
    })
  );
}

export async function download(results: SubtitleResult[]) {
  if (results.length === 0) return;

  results.forEach((r) => {
    zip.file(r.name, r.content);
  });

  const pathSegments = results[0].path.split("/");
  const directoryName = pathSegments[pathSegments.length - 2] ?? "subtitles";
  const blob = await zip.generateAsync({ type: "blob" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.style.display = "none";
  a.href = url;
  a.download = directoryName + ".zip";
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
