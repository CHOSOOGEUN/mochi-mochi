import { Beam, LevelState, Target, Particle, Point, Prism, Obstacle } from './types';
import { COLORS, PHYSICS } from './constants';

function distance(p1: Point, p2: Point) {
    return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

function normalizeVector(v: Point) {
    const len = Math.hypot(v.x, v.y);
    if (len < 0.0001) return { x: 0, y: 1 };
    return { x: v.x / len, y: v.y / len };
}

function dot(v1: Point, v2: Point) {
    return v1.x * v2.x + v1.y * v2.y;
}

// Ray-Circle intersection helper
function rayCircleIntersect(start: Point, dir: Point, center: Point, radius: number): number | null {
    const L = { x: center.x - start.x, y: center.y - start.y };
    const tca = dot(L, dir);
    const d2 = dot(L, L) - tca * tca;
    const r2 = radius * radius;
    if (d2 > r2) return null;
    const thc = Math.sqrt(r2 - d2);
    let t0 = tca - thc;
    let t1 = tca + thc;

    if (t0 < 1) t0 = t1; // Skip if too close (starts on boundary)
    if (t0 < 1) return null;
    return t0;
}

// Ray-AABB intersection helper
function rayRectIntersect(start: Point, dir: Point, rect: { x: number, y: number, width: number, height: number }): { t: number, normal: Point } | null {
    const xmin = rect.x - rect.width / 2;
    const xmax = rect.x + rect.width / 2;
    const ymin = rect.y - rect.height / 2;
    const ymax = rect.y + rect.height / 2;

    let tmin = -Infinity, tmax = Infinity;
    let nmin = { x: 0, y: 0 };

    // X axis
    if (dir.x !== 0.0) {
        let t1 = (xmin - start.x) / dir.x;
        let t2 = (xmax - start.x) / dir.x;
        let normal1 = { x: -1, y: 0 };
        let normal2 = { x: 1, y: 0 };
        if (t1 > t2) { [t1, t2] = [t2, t1];[normal1, normal2] = [normal2, normal1]; }
        if (t1 > tmin) { tmin = t1; nmin = normal1; }
        tmax = Math.min(tmax, t2);
    } else if (start.x < xmin || start.x > xmax) return null;

    // Y axis
    if (dir.y !== 0.0) {
        let t1 = (ymin - start.y) / dir.y;
        let t2 = (ymax - start.y) / dir.y;
        let normal1 = { x: 0, y: -1 };
        let normal2 = { x: 0, y: 1 };
        if (t1 > t2) { [t1, t2] = [t2, t1];[normal1, normal2] = [normal2, normal1]; }
        if (t1 > tmin) { tmin = t1; nmin = normal1; }
        tmax = Math.min(tmax, t2);
    } else if (start.y < ymin || start.y > ymax) return null;

    if (tmax > Math.max(0, tmin) && tmax > 1) {
        const t = tmin > 1 ? tmin : tmax;
        if (t < 1) return null;
        return { t, normal: nmin };
    }
    return null;
}

export function createBeam(start: Point, dir: Point, color: string, state: LevelState, depth: number = 0, ignoreObjId?: string): Beam[] {
    if (depth > 15) return [];

    let end: Point = { x: start.x + dir.x * 2000, y: start.y + dir.y * 2000 };
    let closestHitDist = 3000;
    let hitType = 'none';
    let hitObj: any = null;
    let hitNormal: Point = { x: 0, y: 0 };

    // Check prisms
    for (const prism of state.prisms) {
        if (prism.id === ignoreObjId) continue;
        const t = rayCircleIntersect(start, dir, prism.position, PHYSICS.PRISM_RADIUS);
        if (t !== null && t < closestHitDist) {
            closestHitDist = t;
            hitType = 'prism';
            hitObj = prism;
            const hitPt = { x: start.x + dir.x * t, y: start.y + dir.y * t };
            hitNormal = normalizeVector({ x: hitPt.x - prism.position.x, y: hitPt.y - prism.position.y });
        }
    }

    // Check targets
    for (const target of state.targets) {
        // Targets can be hit by colored beams of SAME color
        if (target.id === ignoreObjId) continue;
        const t = rayCircleIntersect(start, dir, target.position, PHYSICS.TARGET_RADIUS);
        if (t !== null && t < closestHitDist) {
            closestHitDist = t;
            hitType = 'target';
            hitObj = target;
        }
    }

    // Check obstacles
    for (const obs of state.obstacles) {
        if (obs.id === ignoreObjId) continue;
        const res = rayRectIntersect(start, dir, { ...obs.position, width: obs.width, height: obs.height });
        if (res !== null && res.t < closestHitDist) {
            closestHitDist = res.t;
            hitType = 'obstacle';
            hitObj = obs;
            hitNormal = res.normal;
        }
    }

    if (hitType !== 'none') {
        end = { x: start.x + dir.x * closestHitDist, y: start.y + dir.y * closestHitDist };
    }

    const beams: Beam[] = [{ start, end, color, width: PHYSICS.BEAM_WIDTH }];

    if (hitType === 'prism') {
        if (color === COLORS.WHITE_BEAM) {
            // White beam hits -> Split and CONTINUE (ignore this prism so they go through)
            // We'll push them slightly forward to ensure they don't hit the entry again
            const splitOrigin = end;
            const rDir = normalizeVector({ x: dir.x - 0.4, y: dir.y + 0.9 });
            const gDir = normalizeVector({ x: dir.x, y: dir.y + 1.0 });
            const bDir = normalizeVector({ x: dir.x + 0.4, y: dir.y + 0.9 });

            beams.push(...createBeam(splitOrigin, rDir, COLORS.RED, state, depth + 1, hitObj.id));
            beams.push(...createBeam(splitOrigin, gDir, COLORS.GREEN, state, depth + 1, hitObj.id));
            beams.push(...createBeam(splitOrigin, bDir, COLORS.BLUE, state, depth + 1, hitObj.id));
        } else {
            // Colored beam hits prism from OUTSIDE -> Reflect!
            if (dot(dir, hitNormal) < 0) {
                const reflectDir = normalizeVector({
                    x: dir.x - 2 * dot(dir, hitNormal) * hitNormal.x,
                    y: dir.y - 2 * dot(dir, hitNormal) * hitNormal.y
                });
                beams.push(...createBeam(end, reflectDir, color, state, depth + 1, hitObj.id));
            } else {
                // Hitting from inside or tangent? Just pass through
                beams.push(...createBeam(end, dir, color, state, depth + 1, hitObj.id));
            }
        }
    } else if (hitType === 'target') {
        if (hitObj.color === color) {
            hitObj.hit = true;
        }
    } else if (hitType === 'obstacle') {
        if (hitObj.isMirror) {
            // Reflect on mirror
            const reflectDir = normalizeVector({
                x: dir.x - 2 * dot(dir, hitNormal) * hitNormal.x,
                y: dir.y - 2 * dot(dir, hitNormal) * hitNormal.y
            });
            beams.push(...createBeam(end, reflectDir, color, state, depth + 1, hitObj.id));
        }
        // If not mirror, it just stops (AABB block)
    }

    return beams;
}

export function updateEngine(state: LevelState): LevelState {
    state.beams = [];
    state.targets.forEach(t => t.hit = false);

    // We must rebuild targets every frame because they are objects in a list
    const initialSourceDir = { x: 0, y: 1 };
    state.beams = createBeam(state.source, initialSourceDir, COLORS.WHITE_BEAM, state);

    // Update existing particles
    state.particles = state.particles.map(p => ({
        ...p, position: { x: p.position.x + p.velocity.x, y: p.position.y + p.velocity.y }, life: p.life - 1
    })).filter(p => p.life > 0);

    const allHit = state.targets.length > 0 && state.targets.every(t => t.hit);
    state.cleared = allHit;

    return state;
}

export function addPrismOrRemove(state: LevelState, pos: Point): LevelState {
    for (let i = 0; i < state.prisms.length; i++) {
        if (distance(state.prisms[i].position, pos) < PHYSICS.PRISM_RADIUS * 2) {
            state.prisms.splice(i, 1);
            return updateEngine(state);
        }
    }
    if (state.prisms.length < PHYSICS.MAX_PRISMS) {
        state.prisms.push({ id: Math.random().toString(), position: pos, angle: 0 });
        for (let i = 0; i < 8; i++) {
            state.particles.push({
                id: Math.random().toString(),
                position: pos,
                velocity: { x: (Math.random() - 0.5) * 6, y: (Math.random() - 0.5) * 6 },
                color: COLORS.MENU_AMBIENT[Math.floor(Math.random() * COLORS.MENU_AMBIENT.length)],
                life: PHYSICS.PARTICLE_LIFETIME,
                size: Math.random() * 4 + 2
            });
        }
    }
    return updateEngine(state);
}
