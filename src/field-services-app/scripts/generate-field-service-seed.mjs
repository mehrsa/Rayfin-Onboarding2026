import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const outputPath = resolve(projectRoot, 'src/data/field-service-seed.json');

const STATUSES = [
  'pending',
  'assigned',
  'in_progress',
  'completed',
  'needs_followup',
  'cancelled',
];

const SERVICE_PROS = [
  { seedId: 'pro-001', name: 'Alex Morgan', skills: ['painting', 'hanging', 'drilling'] },
  { seedId: 'pro-002', name: 'Sam Rivera', skills: ['plumbing', 'repair', 'diagnostics'] },
  { seedId: 'pro-003', name: 'Jordan Lee', skills: ['electrical', 'lighting', 'fixtures'] },
  { seedId: 'pro-004', name: 'Taylor Kim', skills: ['carpentry', 'doors', 'trim'] },
  { seedId: 'pro-005', name: 'Casey Patel', skills: ['appliance', 'installation', 'repair'] },
  { seedId: 'pro-006', name: 'Riley Chen', skills: ['hvac', 'maintenance', 'filters'] },
  { seedId: 'pro-007', name: 'Morgan Brooks', skills: ['flooring', 'tile', 'grout'] },
  { seedId: 'pro-008', name: 'Jamie Wilson', skills: ['drywall', 'patching', 'painting'] },
  { seedId: 'pro-009', name: 'Avery Martinez', skills: ['outdoor', 'fencing', 'gates'] },
  { seedId: 'pro-010', name: 'Quinn Davis', skills: ['smart home', 'networking', 'security'] },
  { seedId: 'pro-011', name: 'Drew Thompson', skills: ['assembly', 'mounting', 'furniture'] },
  { seedId: 'pro-012', name: 'Skyler Nguyen', skills: ['windows', 'weatherproofing', 'sealing'] },
];

const TASKS = [
  { task: 'Paint living room accent wall', skills: ['painting'], durationHours: 3 },
  { task: 'Mount framed art above sofa', skills: ['hanging', 'drilling'], durationHours: 2 },
  { task: 'Repair leaking kitchen sink trap', skills: ['plumbing'], durationHours: 2 },
  { task: 'Replace hallway light fixture', skills: ['electrical', 'lighting'], durationHours: 2 },
  { task: 'Plane sticking interior door', skills: ['carpentry', 'doors'], durationHours: 2 },
  { task: 'Install dishwasher anti-tip bracket', skills: ['appliance', 'installation'], durationHours: 2 },
  { task: 'Replace HVAC return filter and inspect vent flow', skills: ['hvac', 'maintenance'], durationHours: 1 },
  { task: 'Re-grout cracked bathroom tile section', skills: ['tile', 'grout'], durationHours: 3 },
  { task: 'Patch drywall around curtain rod anchors', skills: ['drywall', 'patching'], durationHours: 2 },
  { task: 'Repair backyard gate latch', skills: ['outdoor', 'gates'], durationHours: 2 },
  { task: 'Install smart doorbell and connect app', skills: ['smart home', 'security'], durationHours: 2 },
  { task: 'Assemble modular office shelves', skills: ['assembly', 'furniture'], durationHours: 3 },
  { task: 'Seal drafty window frame', skills: ['windows', 'weatherproofing'], durationHours: 2 },
  { task: 'Hang gallery wall with six frames', skills: ['hanging', 'mounting'], durationHours: 3 },
  { task: 'Replace bathroom faucet cartridge', skills: ['plumbing', 'repair'], durationHours: 2 },
  { task: 'Install under-cabinet task lighting', skills: ['electrical', 'lighting'], durationHours: 3 },
  { task: 'Repair loose stair trim', skills: ['carpentry', 'trim'], durationHours: 2 },
  { task: 'Level and secure washing machine', skills: ['appliance', 'repair'], durationHours: 1 },
  { task: 'Clean and test mini-split filters', skills: ['hvac', 'filters'], durationHours: 2 },
  { task: 'Replace cracked entry tile', skills: ['flooring', 'tile'], durationHours: 3 },
  { task: 'Patch ceiling nail pops and repaint', skills: ['drywall', 'painting'], durationHours: 3 },
  { task: 'Reset sagging fence hinge', skills: ['outdoor', 'fencing'], durationHours: 2 },
  { task: 'Configure mesh Wi-Fi access point', skills: ['networking', 'smart home'], durationHours: 2 },
  { task: 'Anchor wardrobe to wall studs', skills: ['mounting', 'drilling'], durationHours: 1 },
];

const CUSTOMERS = [
  'Amelia Hart',
  'Noah Laurent',
  'Maya Sinclair',
  'Leo Dubois',
  'Nora Bennett',
  'Eli Martin',
  'Sofia Moreau',
  'Theo Bernard',
  'Iris Clement',
  'Milo Fischer',
  'Lena Rossi',
  'Owen Meyer',
  'Chloe Perrin',
  'Hugo Garnier',
  'Emma Costa',
  'Lucas Renard',
  'Ines Mercier',
  'Felix Roy',
  'Clara Vidal',
  'Jules Faure',
];

const STREETS = [
  'Rue des Lilas',
  'Avenue Victor Hugo',
  'Boulevard Saint-Michel',
  'Rue de la Republique',
  'Cours Lafayette',
  'Rue Oberkampf',
  'Quai Saint-Antoine',
  'Rue Nationale',
  'Avenue Jean Jaures',
  'Rue du Port',
  'Place Bellecour',
  'Rue Sainte-Catherine',
];

const CITIES = [
  'Paris',
  'Lyon',
  'Marseille',
  'Toulouse',
  'Nantes',
  'Lille',
  'Bordeaux',
  'Rennes',
  'Grenoble',
  'Montpellier',
];

function parseArgs(argv) {
  const args = new Map();
  for (let index = 0; index < argv.length; index += 1) {
    const item = argv[index];
    if (item.startsWith('--')) {
      const [key, value] = item.includes('=') ? item.split('=', 2) : [item, argv[index + 1]];
      args.set(key.slice(2), value);
      if (!item.includes('=')) {
        index += 1;
      }
    }
  }
  return args;
}

function createRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function pick(items, random) {
  return items[Math.floor(random() * items.length)];
}

function toDateOnly(date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function isWorkingDay(date) {
  const day = date.getUTCDay();
  return day >= 1 && day <= 5;
}

function matchesSkills(profile, task) {
  return task.skills.some((skill) => profile.skills.includes(skill));
}

function getStatus(scheduledAt, endDate, random, hasServicePro) {
  if (!hasServicePro) {
    return 'pending';
  }

  const daysFromEnd = Math.floor((endDate.getTime() - scheduledAt.getTime()) / 86_400_000);
  if (daysFromEnd <= 1) {
    return random() < 0.65 ? 'assigned' : 'in_progress';
  }
  if (daysFromEnd <= 14) {
    const recent = ['assigned', 'in_progress', 'completed', 'needs_followup'];
    return pick(recent, random);
  }

  const roll = random();
  if (roll < 0.82) {
    return 'completed';
  }
  if (roll < 0.93) {
    return 'needs_followup';
  }
  return 'cancelled';
}

function createDataset(endDate) {
  const random = createRandom(0x51eed5);
  const startDate = addDays(endDate, -365);
  const servicePros = SERVICE_PROS.map((profile) => ({
    ...profile,
    userId: `seed.${profile.seedId}@field-service.local`,
  }));
  const workOrders = [];
  let sequence = 1000;
  let profileCursor = 0;

  for (let day = new Date(startDate); day <= endDate; day = addDays(day, 1)) {
    if (!isWorkingDay(day)) {
      continue;
    }

    const jobsToday = 3 + Math.floor(random() * 3);
    const usedSlots = new Set();

    for (let jobIndex = 0; jobIndex < jobsToday; jobIndex += 1) {
      const task = pick(TASKS, random);
      const matchingProfiles = servicePros.filter((profile) => matchesSkills(profile, task));
      const profilePool = matchingProfiles.length > 0 ? matchingProfiles : servicePros;
      const servicePro = profilePool[(profileCursor + jobIndex) % profilePool.length];
      profileCursor = (profileCursor + 1) % servicePros.length;
      const unassigned = random() < 0.08;
      const hourOptions = [8, 9, 10, 11, 13, 14, 15, 16];
      let hour = pick(hourOptions, random);
      while (usedSlots.has(hour)) {
        hour = pick(hourOptions, random);
      }
      usedSlots.add(hour);

      const scheduledAt = new Date(day);
      scheduledAt.setUTCHours(hour, random() < 0.5 ? 0 : 30, 0, 0);
      const status = getStatus(scheduledAt, endDate, random, !unassigned);
      const customer = pick(CUSTOMERS, random);
      const streetNumber = 1 + Math.floor(random() * 148);
      const address = `${streetNumber} ${pick(STREETS, random)}, ${pick(CITIES, random)}`;
      const note =
        status === 'needs_followup'
          ? `Follow-up needed after initial ${task.durationHours}h visit; bring specialized parts and confirm access window.`
          : status === 'cancelled'
            ? 'Cancelled by customer before arrival.'
            : '';

      sequence += 1;
      workOrders.push({
        id: `wo-${sequence}`,
        customer,
        address,
        task: task.task,
        scheduledAt: scheduledAt.toISOString(),
        status,
        serviceProSeedId: unassigned ? null : servicePro.seedId,
        note,
      });
    }
  }

  return {
    generatedAt: new Date(`${toDateOnly(endDate)}T12:00:00Z`).toISOString(),
    startDate: toDateOnly(startDate),
    endDate: toDateOnly(endDate),
    servicePros,
    workOrders,
  };
}

function validateDataset(dataset) {
  const errors = [];
  const serviceProIds = new Set(dataset.servicePros.map((profile) => profile.seedId));
  const jobsByDay = new Map();

  if (dataset.servicePros.length < 12) {
    errors.push(`Expected at least 12 Service Pro profiles, found ${dataset.servicePros.length}.`);
  }

  for (const profile of dataset.servicePros) {
    if (!profile.seedId || !profile.name || !profile.userId) {
      errors.push(`Invalid Service Pro profile: ${JSON.stringify(profile)}`);
    }
    if (!Array.isArray(profile.skills) || profile.skills.length === 0) {
      errors.push(`Service Pro ${profile.seedId} must have at least one skill.`);
    }
  }

  for (const order of dataset.workOrders) {
    const date = new Date(order.scheduledAt);
    const day = toDateOnly(date);
    jobsByDay.set(day, (jobsByDay.get(day) ?? 0) + 1);

    if (!order.id || !order.customer || !order.address || !order.task) {
      errors.push(`Invalid work order: ${JSON.stringify(order)}`);
    }
    if (!STATUSES.includes(order.status)) {
      errors.push(`Work order ${order.id} has invalid status ${order.status}.`);
    }
    if (!isWorkingDay(date)) {
      errors.push(`Work order ${order.id} is scheduled on a non-working day.`);
    }
    if (order.serviceProSeedId && !serviceProIds.has(order.serviceProSeedId)) {
      errors.push(`Work order ${order.id} references unknown Service Pro ${order.serviceProSeedId}.`);
    }
    if (!order.serviceProSeedId && order.status !== 'pending') {
      errors.push(`Unassigned work order ${order.id} must be pending.`);
    }
  }

  for (
    let day = new Date(`${dataset.startDate}T00:00:00Z`);
    day <= new Date(`${dataset.endDate}T00:00:00Z`);
    day = addDays(day, 1)
  ) {
    if (!isWorkingDay(day)) {
      continue;
    }
    const count = jobsByDay.get(toDateOnly(day)) ?? 0;
    if (count < 3 || count > 5) {
      errors.push(`${toDateOnly(day)} has ${count} jobs; expected 3-5.`);
    }
  }

  return errors;
}

async function readDataset(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const validateOnly = args.has('validate');
  const endArg = args.get('end') ?? process.env.SEED_END_DATE;
  const endDate = endArg ? new Date(`${endArg}T00:00:00Z`) : new Date();
  endDate.setUTCHours(0, 0, 0, 0);

  const dataset = validateOnly ? await readDataset(outputPath) : createDataset(endDate);
  const errors = validateDataset(dataset);

  if (errors.length > 0) {
    console.error(`Seed data validation failed with ${errors.length} error(s):`);
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
    return;
  }

  if (!validateOnly) {
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, `${JSON.stringify(dataset, null, 2)}\n`);
  }

  console.log(
    `Seed data valid: ${dataset.servicePros.length} Service Pros, ${dataset.workOrders.length} work orders from ${dataset.startDate} to ${dataset.endDate}.`
  );
}

await main();
