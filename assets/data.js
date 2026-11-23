// Lenovo-era ThinkPads (2005 onwards). All data for this site lives here.
// To add a model: add an entry below, then run  ./new-model.sh <id>
//
// Model fields
//   id, name, year, series, summary
//   specs   : { "Label": "Value", ... }          free-form rows
//   gpu     : [ { name, type, optional, vram, note } ]
//               type     "integrated" = built into the CPU/chipset, shares system RAM
//                        "discrete"   = separate GPU chip with its own video memory (soldered, can't be added later)
//               optional true  = only some configurations have it (chosen when buying)
//   storage : [ { slot, interface, note } ]     every place a drive can go (2.5" bay, M.2, mSATA, WWAN slot...)
//   ports   : [ { name, count, note } ]         count and note are optional
//   notes   : [ { text, source, unverified } ]  extra info; source (URL) and unverified (true) are optional
//   docs    : [ { label, url } ]                spec sheets and other links. url can be external (Lenovo PSREF)
//                                               or a file in this repo, e.g. "docs/t460p-spec.pdf"
//   pros, cons : [ "text", ... ]
//   verified: true   (add once you have checked the data; unverified pages show a small notice)
//
// Lenovo spec sheet (PSREF) pattern, check each link opens before adding it:
//   https://psref.lenovo.com/syspool/Sys/PDF/ThinkPad/ThinkPad_<MODEL>/ThinkPad_<MODEL>_Spec.PDF
(window.THINKPAD = window.THINKPAD || {}).lenovo = {
  site: {
    label: "Lenovo",
    name: "Lenovo ThinkPads",
    tagline: "ThinkPads from the Lenovo era (2005 to today): specs, strengths and quirks.",
    host: "https://lenovo.thinkpad.fi/",
    main: "https://thinkpad.fi/",
    other: { name: "IBM ThinkPads", url: "https://ibm.thinkpad.fi/" },
  },
  models: [
    {
      id: "t460p",
      name: "ThinkPad T460p",
      year: 2016,
      series: "T",
      verified: true,
      summary: "A 14-inch performance ThinkPad with quad-core HQ processors and optional discrete graphics.",
      specs: {
        "Display": "14\" FHD 1920×1080 IPS or WQHD 2560×1440 IPS, anti-glare, touch optional",
        "CPU": "Intel Core i5-6300HQ / i5-6440HQ / i7-6700HQ / i7-6820HQ (6th gen, quad-core)",
        "Memory": "DDR4-2133, up to 32 GB (2 SO-DIMM slots)",
        "Storage": "2.5\" SATA drive or PCIe NVMe SSD (see Storage slots)",
        "Battery": "3-cell 23 Wh, or 6-cell 48 Wh / 72 Wh",
        "Keyboard": "6-row, spill-resistant, LED backlight",
        "Wireless": "M.2 WLAN card (Intel 8260 or Broadcom BCM4356), optional M.2 WWAN",
        "Weight": "1.81 kg (3-cell, integrated GPU) to 2.15 kg (6-cell, discrete GPU)",
      },
      gpu: [
        { name: "Intel HD Graphics 530", type: "integrated", note: "Part of the CPU, always present." },
        { name: "NVIDIA GeForce 940MX", type: "discrete", optional: true, vram: "2 GB", note: "Only on configurations ordered with it." },
      ],
      storage: [
        { slot: "2.5\" drive bay", interface: "SATA 6 Gbit/s", note: "HDD or SSD, 7 mm or 9.5 mm high." },
        { slot: "PCIe NVMe SSD", interface: "PCIe 3.0 x2 (NVMe)", note: "Listed by Lenovo as a factory option. The spec sheet does not say which connector it uses." },
        { slot: "WWAN slot (M.2 2242)", interface: "M.2 SATA", note: "Reported to work for an SSD (ThinkWiki), but not an official use; bootability not confirmed." },
      ],
      ports: [
        { name: "USB 3.0 (Type-A)", count: 3, note: "one is always-on for charging" },
        { name: "HDMI", count: 1 },
        { name: "Mini DisplayPort", count: 1 },
        { name: "Ethernet (RJ-45)", count: 1 },
        { name: "Dock connector", count: 1 },
        { name: "4-in-1 media reader", count: 1, note: "MMC, SD, SDHC, SDXC" },
        { name: "Smart card reader", count: 1, note: "optional" },
        { name: "Headset jack (combo)", count: 1 },
      ],
      notes: [
        { text: "Reported: the T460p has a SATA Express-style connector, so a PCIe NVMe SSD can be used with an adapter. The Lenovo spec sheet and ThinkWiki do not mention this, so confirm it before buying an adapter.", unverified: true },
        { text: "Prefer single-sided SSD modules in newer ThinkPads. Double-sided ones can press on the mainboard and lift the connector, and some heatsinks may not fit.", source: "https://thinkwiki.de/SSD_f%C3%BCr_Anf%C3%A4nger" },
      ],
      docs: [
        { label: "Lenovo PSREF spec sheet (PDF)", url: "https://psref.lenovo.com/syspool/Sys/PDF/ThinkPad/ThinkPad_T460p/ThinkPad_T460p_Spec.PDF" },
        { label: "ThinkWiki: SSD guide (German)", url: "https://thinkwiki.de/SSD_f%C3%BCr_Anf%C3%A4nger" },
      ],
      pros: ["Real quad-core CPU", "Two RAM slots and flexible storage options", "Backlit, spill-resistant keyboard", "Easy to service"],
      cons: ["Heavier than the thinner T460", "No Thunderbolt", "Battery life depends heavily on the battery option"],
    },
    {
      id: "t420",
      name: "ThinkPad T420",
      year: 2011,
      series: "T",
      summary: "A classic 14-inch workhorse with the 7-row keyboard and strong serviceability.",
      specs: {
        "Display": "14\" 1366×768 (1600×900 optional)",
        "CPU": "Intel Core i5/i7 (Sandy Bridge, 2nd gen)",
        "Memory": "DDR3 SO-DIMM, up to 16 GB (2 slots)",
        "Storage": "2.5\" SATA, mSATA in the WWAN slot",
        "Keyboard": "Classic 7-row",
        "Weight": "~2.3 kg",
      },
      gpu: [
        { name: "Intel HD Graphics 3000", type: "integrated", note: "Part of the CPU, always present." },
        { name: "NVIDIA NVS 4200M", type: "discrete", optional: true, vram: "1 GB", note: "Only on configurations ordered with it (Optimus switching)." },
      ],
      storage: [
        { slot: "2.5\" drive bay", interface: "SATA" },
        { slot: "WWAN slot (mini PCIe)", interface: "mSATA", note: "Bootable and an officially supported use, according to ThinkWiki." },
      ],
      ports: [
        { name: "USB", note: "USB 2.0, one combined with eSATA" },
        { name: "VGA" },
        { name: "DisplayPort" },
        { name: "Ethernet (RJ-45)" },
        { name: "ExpressCard/34" },
        { name: "Card reader" },
        { name: "Headphone / microphone jacks" },
        { name: "Docking connector" },
      ],
      notes: [
        { text: "The WWAN slot takes an mSATA SSD that you can boot from. This is the same on the T420s, T430 and T430s.", source: "https://thinkwiki.de/SSD_f%C3%BCr_Anf%C3%A4nger" },
      ],
      docs: [
        { label: "ThinkWiki: SSD guide (German)", url: "https://thinkwiki.de/SSD_f%C3%BCr_Anf%C3%A4nger" },
      ],
      pros: ["Classic keyboard", "Very easy to service", "Ports galore (ExpressCard, VGA, DisplayPort)"],
      cons: ["Heavier than modern machines", "Dated performance", "Mediocre stock screen"],
    },
    {
      id: "x220",
      name: "ThinkPad X220",
      year: 2011,
      series: "X",
      summary: "The last X-series with the classic 7-row keyboard. A small, tough, hugely popular retro favourite.",
      specs: {
        "Display": "12.5\" 1366×768 (TN, IPS optional)",
        "CPU": "Intel Core i3/i5/i7 (Sandy Bridge, 2nd gen)",
        "Memory": "DDR3 SO-DIMM, up to 16 GB (2 slots)",
        "Storage": "2.5\" SATA, mSATA in the WWAN slot",
        "Keyboard": "Classic 7-row",
        "Weight": "~1.3 kg",
      },
      gpu: [
        { name: "Intel HD Graphics 3000", type: "integrated", note: "Part of the CPU. No discrete GPU option." },
      ],
      storage: [
        { slot: "2.5\" drive bay", interface: "SATA" },
        { slot: "WWAN slot (mini PCIe)", interface: "mSATA", note: "Limited to SATA II speeds. Bootable and an officially supported use, according to ThinkWiki." },
      ],
      ports: [
        { name: "USB", note: "USB 2.0 (some units also have USB 3.0)" },
        { name: "VGA" },
        { name: "DisplayPort" },
        { name: "Ethernet (RJ-45)" },
        { name: "ExpressCard/34" },
        { name: "SD card reader" },
        { name: "Headset jack (combo)" },
        { name: "Docking connector" },
      ],
      notes: [
        { text: "An mSATA SSD in the WWAN slot is capped at SATA II speeds but can be the boot drive. The same applies to the X220 Tablet, X230 and X230 Tablet.", source: "https://thinkwiki.de/SSD_f%C3%BCr_Anf%C3%A4nger" },
      ],
      docs: [
        { label: "ThinkWiki: SSD guide (German)", url: "https://thinkwiki.de/SSD_f%C3%BCr_Anf%C3%A4nger" },
      ],
      pros: ["Excellent classic keyboard", "Compact and robust", "Easy to repair and upgrade", "Great Linux support"],
      cons: ["Low-resolution screen", "Old CPU for modern web", "Battery life depends on aftermarket cells"],
    },
    {
      id: "x230",
      name: "ThinkPad X230",
      year: 2012,
      series: "X",
      summary: "The Ivy Bridge successor to the X220, with a chiclet keyboard and optional IPS panel.",
      specs: {
        "Display": "12.5\" 1366×768 (IPS optional)",
        "CPU": "Intel Core i3/i5/i7 (Ivy Bridge, 3rd gen)",
        "Memory": "DDR3 SO-DIMM, up to 16 GB (2 slots)",
        "Storage": "2.5\" SATA, mSATA in the WWAN slot",
        "Keyboard": "Chiclet (6-row)",
        "Weight": "~1.4 kg",
      },
      gpu: [
        { name: "Intel HD Graphics 4000", type: "integrated", note: "Part of the CPU. No discrete GPU option." },
      ],
      storage: [
        { slot: "2.5\" drive bay", interface: "SATA" },
        { slot: "WWAN slot (mini PCIe)", interface: "mSATA", note: "Limited to SATA II speeds. Bootable and an officially supported use, according to ThinkWiki." },
      ],
      ports: [
        { name: "USB 3.0 (Type-A)", count: 2 },
        { name: "USB 2.0 (Type-A)", count: 1 },
        { name: "VGA" },
        { name: "Mini DisplayPort" },
        { name: "Ethernet (RJ-45)" },
        { name: "ExpressCard/34" },
        { name: "SD card reader" },
        { name: "Headset jack (combo)" },
        { name: "Docking connector" },
      ],
      notes: [
        { text: "An mSATA SSD in the WWAN slot is capped at SATA II speeds but can be the boot drive.", source: "https://thinkwiki.de/SSD_f%C3%BCr_Anf%C3%A4nger" },
      ],
      docs: [
        { label: "ThinkWiki: SSD guide (German)", url: "https://thinkwiki.de/SSD_f%C3%BCr_Anf%C3%A4nger" },
      ],
      pros: ["Better IPS option", "Faster than X220", "Compact, repairable"],
      cons: ["Chiclet keyboard is a downgrade for classic fans", "Low resolution"],
    },
    {
      id: "t480",
      name: "ThinkPad T480",
      year: 2018,
      series: "T",
      summary: "A modern-enough daily driver with quad-core CPUs, USB-C/Thunderbolt 3 and dual batteries.",
      specs: {
        "Display": "14\" 1920×1080 IPS",
        "CPU": "Intel Core i5-8250U / i7-8550U (8th gen, quad-core)",
        "Memory": "DDR4 SO-DIMM, up to 32 GB (2 slots)",
        "Storage": "M.2 NVMe SSD (main slot), second M.2 in the WWAN slot",
        "Battery": "Internal + hot-swappable external",
        "Weight": "~1.6 kg",
      },
      gpu: [
        { name: "Intel UHD Graphics 620", type: "integrated", note: "Part of the CPU, always present." },
        { name: "NVIDIA GeForce MX150", type: "discrete", optional: true, vram: "2 GB GDDR5", note: "Only on configurations ordered with it." },
      ],
      storage: [
        { slot: "M.2 2280 (main slot)", interface: "PCIe NVMe", note: "Main SSD slot." },
        { slot: "WWAN slot (M.2 2242)", interface: "PCIe x2 NVMe", note: "Bootable and an officially supported use, according to ThinkWiki. 2230 drives fit with a 2230-to-2242 adapter." },
      ],
      ports: [
        { name: "Thunderbolt 3 (USB-C)", count: 1 },
        { name: "USB-C 3.1 Gen 1", count: 1 },
        { name: "USB 3.1 Gen 1 (Type-A)", count: 2, note: "one is always-on for charging" },
        { name: "HDMI 1.4", count: 1 },
        { name: "Ethernet (RJ-45)", count: 1 },
        { name: "SD card reader", count: 1 },
        { name: "Headset jack (combo)", count: 1 },
      ],
      notes: [
        { text: "Use single-sided SSD modules. When buying a 2230 drive for the 2242 slot, check where the M-key notch sits on the card, and some 2280 drives need shortening to fit.", source: "https://thinkwiki.de/SSD_f%C3%BCr_Anf%C3%A4nger" },
      ],
      docs: [
        { label: "ThinkWiki: SSD guide (German)", url: "https://thinkwiki.de/SSD_f%C3%BCr_Anf%C3%A4nger" },
      ],
      pros: ["Dual battery system", "Quad-core performance", "Upgradeable RAM and SSD", "Good keyboard"],
      cons: ["Some units throttle under load", "Display quality varies by option"],
    },
    {
      id: "x1-carbon-gen9",
      name: "ThinkPad X1 Carbon Gen 9",
      year: 2021,
      series: "X1",
      summary: "Lightweight premium ultrabook with a 16:10 display and 11th gen Intel.",
      specs: {
        "Display": "14\" 16:10 (1920×1200 or higher options)",
        "CPU": "Intel Core 11th gen (up to i7)",
        "Memory": "Soldered LPDDR4x, up to 32 GB",
        "Storage": "M.2 NVMe SSD",
        "Weight": "~1.1 kg",
      },
      gpu: [
        { name: "Intel Iris Xe Graphics", type: "integrated", note: "Part of the CPU. No discrete GPU option." },
      ],
      storage: [
        { slot: "M.2 SSD slot", interface: "PCIe NVMe", note: "Not covered by the ThinkWiki guide; details not yet checked." },
      ],
      ports: [
        { name: "Thunderbolt 4 (USB-C)", count: 2 },
        { name: "USB 3.2 Gen 1 (Type-A)", count: 2 },
        { name: "HDMI 2.0", count: 1 },
        { name: "Headset jack (combo)", count: 1 },
      ],
      pros: ["Very light", "16:10 display", "Great keyboard for its size"],
      cons: ["RAM is soldered", "Less repairable than older ThinkPads"],
    },
  ],
};
