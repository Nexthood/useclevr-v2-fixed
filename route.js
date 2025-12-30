import { NextResponse } from "next/server";
import Papa from "papaparse";

export async function POST(req) {
  try {
    const body = await req.json();
    let { dataset } = body;

    if (!dataset || dataset.length === 0) {
      return NextResponse.json({ error: "Dataset empty" });
    }

    const cols = Object.keys(dataset[0]);

    // -----------------------------------------
    // REMOVE EMPTY COLUMNS
    // -----------------------------------------
    const cleanedColumns = cols.filter((col) => {
      return dataset.some((row) => row[col] !== "" && row[col] != null);
    });

    dataset = dataset.map((row) => {
      const newRow = {};
      cleanedColumns.forEach((c) => {
        newRow[c] = row[c];
      });
      return newRow;
    });

    // -----------------------------------------
    // REMOVE DUPLICATES
    // -----------------------------------------
    const seen = new Set();
    dataset = dataset.filter((row) => {
      const key = JSON.stringify(row);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // -----------------------------------------
    // CLEAN COMMON DIRTY VALUES
    // -----------------------------------------
    const dirtyValues = ["N/A", "null", "undefined", "-", "", "missing"];

    dataset = dataset.map((row) => {
      const newRow = {};
      Object.keys(row).forEach((c) => {
        const v = row[c];
        if (dirtyValues.includes(String(v).trim().toLowerCase())) {
          newRow[c] = "";
        } else {
          newRow[c] = v;
        }
      });
      return newRow;
    });

    // -----------------------------------------
    // OUTLIER REMOVAL (3x standard deviation)
    // -----------------------------------------
    cleanedColumns.forEach((col) => {
      const numeric = dataset
        .map((r) => parseFloat(r[col]))
        .filter((n) => !isNaN(n));

      if (numeric.length < 5) return;

      const mean =
        numeric.reduce((a, b) => a + b, 0) / numeric.length;
      const variance =
        numeric.reduce((a, b) => a + (b - mean) ** 2, 0) /
        numeric.length;
      const std = Math.sqrt(variance);

      dataset = dataset.filter((row) => {
        const v = parseFloat(row[col]);
        if (isNaN(v)) return true;
        return v >= mean - 3 * std && v <= mean + 3 * std;
      });
    });

    // -----------------------------------------
    // DATE NORMALIZATION (Convert to YYYY-MM-DD)
    // -----------------------------------------
    dataset = dataset.map((row) => {
      const newRow = { ...row };

      cleanedColumns.forEach((col) => {
        const v = row[col];

        if (typeof v === "string" && !isNaN(Date.parse(v))) {
          const d = new Date(v);
          if (!isNaN(d.getTime())) {
            newRow[col] = d.toISOString().split("T")[0];
          }
        }
      });

      return newRow;
    });

    // -----------------------------------------
    // CONVERT TO CSV
    // -----------------------------------------
    const csv = Papa.unparse(dataset);

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=useclevr_cleaned.csv",
      },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message });
  }
}
