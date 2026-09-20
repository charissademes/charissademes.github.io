const fs = require('node:fs');

const baseUrl = 'https://inschrijven.schaatsen.nl/api/competitions';

async function getJson(url) {
    const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
    return response.json();
}

function toEntry(competition) {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Amsterdam', year: 'numeric', month: '2-digit',
        day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(new Date(competition.starts));
    const local = Object.fromEntries(parts.map(part => [part.type, part.value]));
    return {
        name: competition.name,
        starts: competition.starts,
        date: `${local.year}-${local.month}-${local.day}`,
        time: `${local.hour}:${local.minute}`,
        city: competition.venue?.address?.city || competition.location || '',
        url: `https://inschrijven.schaatsen.nl/#/wedstrijd/${competition.id}/informatie`
    };
}

async function main() {
    const now = Date.now();
    const competitions = await getJson(baseUrl);
    if (!Array.isArray(competitions)) throw new Error('Invalid competitions response');
    const matches = [];
    for (const competition of competitions) {
        if (competition.discipline !== 'SpeedSkating.LongTrack') continue;
        const start = Date.parse(competition.starts);
        if (!Number.isFinite(start)) throw new Error(`Invalid start: ${competition.id}`);
        if (start <= now) continue;
        const groups = await getJson(`${baseUrl}/${competition.id}/competitors`);
        if (!Array.isArray(groups)) throw new Error(`Invalid competitors: ${competition.id}`);
        const found = groups.some(group => (group.competitors || []).some(entry =>
            entry.competitor?.fullName?.trim().toLowerCase() === 'charissa de mes'));
        if (found) {
            const detail = await getJson(`${baseUrl}/${competition.id}`);
            matches.push(toEntry(detail));
            console.log(`Found: ${detail.name}`);
        }
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    matches.sort((a, b) => Date.parse(a.starts) - Date.parse(b.starts));
    // Only replace the previous list after every request succeeds.
    fs.mkdirSync('data', { recursive: true });
    fs.writeFileSync('data/competitions.json', JSON.stringify(matches, null, 2) + '\n');
    console.log(`Saved ${matches.length} upcoming competitions.`);
}

module.exports = { toEntry };
if (require.main === module) main().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
