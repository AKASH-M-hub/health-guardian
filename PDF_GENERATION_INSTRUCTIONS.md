# How to Generate PDF from Jury User Guide

## Method 1: Using Browser (Easiest)

### For Chrome/Edge:
1. Open `JURY_USER_GUIDE.html` in Chrome or Edge browser
2. Press `Ctrl + P` (Windows) or `Cmd + P` (Mac)
3. In the print dialog:
   - Destination: Select "Save as PDF"
   - Paper size: A4
   - Margins: Default
   - Options: Enable "Background graphics"
4. Click "Save"
5. Name it: `Health_Guardian_Jury_Guide.pdf`

### For Firefox:
1. Open `JURY_USER_GUIDE.html` in Firefox
2. Press `Ctrl + P` (Windows) or `Cmd + P` (Mac)
3. Select "Print to PDF" as printer
4. Click "Save"
5. Name it: `Health_Guardian_Jury_Guide.pdf`

---

## Method 2: Using VS Code Extension

1. Install "Print" extension by PDConv
2. Right-click `JURY_USER_GUIDE.html`
3. Select "Print: HTML"
4. Save as PDF

---

## Method 3: Using Online HTML to PDF Converter

1. Visit: https://html2pdf.com/ or https://www.sejda.com/html-to-pdf
2. Upload `JURY_USER_GUIDE.html`
3. Click "Convert"
4. Download `Health_Guardian_Jury_Guide.pdf`

---

## Method 4: Using Command Line (Advanced)

### If you have wkhtmltopdf installed:
```bash
wkhtmltopdf JURY_USER_GUIDE.html Health_Guardian_Jury_Guide.pdf
```

### Using Puppeteer (Node.js):
```bash
npm install -g html-pdf-node

# Create a script and run
node convert-to-pdf.js
```

---

## Recommended Settings for Best Quality

- **Paper Size:** A4 (210mm × 297mm)
- **Orientation:** Portrait
- **Margins:** Default (1 inch)
- **Scale:** 100%
- **Background Graphics:** Enabled
- **Print Headers/Footers:** Disabled

---

## Expected Output

**File Name:** `Health_Guardian_Jury_Guide.pdf`
**Pages:** 3 pages
**File Size:** ~200-400 KB
**Quality:** High-resolution, print-ready

---

## Troubleshooting

### Issue: Colors not showing
**Solution:** Enable "Background graphics" in print settings

### Issue: Layout broken
**Solution:** Try different browser (Chrome recommended)

### Issue: Text cut off
**Solution:** Adjust margins or scale to 95%

---

## Quick Command for Browser Save

**Windows:** `Ctrl + P` → Select "Save as PDF" → Click "Save"
**Mac:** `Cmd + P` → Select "Save as PDF" → Click "Save"

---

**That's it! Your jury guide PDF is ready to submit!** 🎉
