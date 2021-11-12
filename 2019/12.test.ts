import {
  findNumberOfStepsWhenPositionsAndVelocitiesAreTheSameAsAtTheBeginning,
  Satellite,
  SatelliteSystemSnapshot,
  tick
} from './12';

describe('12.ts', () => {
  it('simulates satellites movement 1', () => {
    const system0 = new SatelliteSystemSnapshot([
      new Satellite({x: -1, y: 0, z: 2}),
      new Satellite({x: 2, y: -10, z: -7}),
      new Satellite({x: 4, y: -8, z: 8}),
      new Satellite({x: 3, y: 5, z: -1}),
    ]);

    expect(system0.toString()).toBe([
      'pos=<x=-1, y=0, z=2>, vel=<x=0, y=0, z=0>',
      'pos=<x=2, y=-10, z=-7>, vel=<x=0, y=0, z=0>',
      'pos=<x=4, y=-8, z=8>, vel=<x=0, y=0, z=0>',
      'pos=<x=3, y=5, z=-1>, vel=<x=0, y=0, z=0>'
    ].join('\n'));

    const system1 = system0.tick();
    expect(system1.toString()).toBe([
      'pos=<x=2, y=-1, z=1>, vel=<x=3, y=-1, z=-1>',
      'pos=<x=3, y=-7, z=-4>, vel=<x=1, y=3, z=3>',
      'pos=<x=1, y=-7, z=5>, vel=<x=-3, y=1, z=-3>',
      'pos=<x=2, y=2, z=0>, vel=<x=-1, y=-3, z=1>',
    ].join('\n'));

    const system2 = system1.tick();
    expect(system2.toString()).toBe([
      'pos=<x=5, y=-3, z=-1>, vel=<x=3, y=-2, z=-2>',
      'pos=<x=1, y=-2, z=2>, vel=<x=-2, y=5, z=6>',
      'pos=<x=1, y=-4, z=-1>, vel=<x=0, y=3, z=-6>',
      'pos=<x=1, y=-4, z=2>, vel=<x=-1, y=-6, z=2>',
    ].join('\n'));

    const system3 = system2.tick();
    expect(system3.toString()).toBe([
      'pos=<x=5, y=-6, z=-1>, vel=<x=0, y=-3, z=0>',
      'pos=<x=0, y=0, z=6>, vel=<x=-1, y=2, z=4>',
      'pos=<x=2, y=1, z=-5>, vel=<x=1, y=5, z=-4>',
      'pos=<x=1, y=-8, z=2>, vel=<x=0, y=-4, z=0>',
    ].join('\n'));

    const system4 = system3.tick();
    expect(system4.toString()).toBe([
      'pos=<x=2, y=-8, z=0>, vel=<x=-3, y=-2, z=1>',
      'pos=<x=2, y=1, z=7>, vel=<x=2, y=1, z=1>',
      'pos=<x=2, y=3, z=-6>, vel=<x=0, y=2, z=-1>',
      'pos=<x=2, y=-9, z=1>, vel=<x=1, y=-1, z=-1>',
    ].join('\n'));

    const system5 = system4.tick();
    expect(system5.toString()).toBe([
      'pos=<x=-1, y=-9, z=2>, vel=<x=-3, y=-1, z=2>',
      'pos=<x=4, y=1, z=5>, vel=<x=2, y=0, z=-2>',
      'pos=<x=2, y=2, z=-4>, vel=<x=0, y=-1, z=2>',
      'pos=<x=3, y=-7, z=-1>, vel=<x=1, y=2, z=-2>',
    ].join('\n'));

    const system6 = system5.tick();
    expect(system6.toString()).toBe([
      'pos=<x=-1, y=-7, z=3>, vel=<x=0, y=2, z=1>',
      'pos=<x=3, y=0, z=0>, vel=<x=-1, y=-1, z=-5>',
      'pos=<x=3, y=-2, z=1>, vel=<x=1, y=-4, z=5>',
      'pos=<x=3, y=-4, z=-2>, vel=<x=0, y=3, z=-1>',
    ].join('\n'));

    const system7 = system6.tick();
    expect(system7.toString()).toBe([
      'pos=<x=2, y=-2, z=1>, vel=<x=3, y=5, z=-2>',
      'pos=<x=1, y=-4, z=-4>, vel=<x=-2, y=-4, z=-4>',
      'pos=<x=3, y=-7, z=5>, vel=<x=0, y=-5, z=4>',
      'pos=<x=2, y=0, z=0>, vel=<x=-1, y=4, z=2>',
    ].join('\n'));

    const system8 = system7.tick();
    expect(system8.toString()).toBe([
      'pos=<x=5, y=2, z=-2>, vel=<x=3, y=4, z=-3>',
      'pos=<x=2, y=-7, z=-5>, vel=<x=1, y=-3, z=-1>',
      'pos=<x=0, y=-9, z=6>, vel=<x=-3, y=-2, z=1>',
      'pos=<x=1, y=1, z=3>, vel=<x=-1, y=1, z=3>',
    ].join('\n'));

    const system9 = system8.tick();
    expect(system9.toString()).toBe([
      'pos=<x=5, y=3, z=-4>, vel=<x=0, y=1, z=-2>',
      'pos=<x=2, y=-9, z=-3>, vel=<x=0, y=-2, z=2>',
      'pos=<x=0, y=-8, z=4>, vel=<x=0, y=1, z=-2>',
      'pos=<x=1, y=1, z=5>, vel=<x=0, y=0, z=2>',
    ].join('\n'));

    const system10 = system9.tick();
    expect(system10.toString()).toBe([
      'pos=<x=2, y=1, z=-3>, vel=<x=-3, y=-2, z=1>',
      'pos=<x=1, y=-8, z=0>, vel=<x=-1, y=1, z=3>',
      'pos=<x=3, y=-6, z=1>, vel=<x=3, y=2, z=-3>',
      'pos=<x=2, y=0, z=4>, vel=<x=1, y=-1, z=-1>',
    ].join('\n'));

    expect(system10.totalEnergy).toBe(179);
  });

  it('simulates satellites movement 2', () => {
    const system0 = new SatelliteSystemSnapshot([
      new Satellite({x: -8, y: -10, z: 0}),
      new Satellite({x: 5, y: 5, z: 10}),
      new Satellite({x: 2, y: -7, z: 3}),
      new Satellite({x: 9, y: -8, z: -3}),
    ]);

    expect(system0.toString()).toBe([
      'pos=<x=-8, y=-10, z=0>, vel=<x=0, y=0, z=0>',
      'pos=<x=5, y=5, z=10>, vel=<x=0, y=0, z=0>',
      'pos=<x=2, y=-7, z=3>, vel=<x=0, y=0, z=0>',
      'pos=<x=9, y=-8, z=-3>, vel=<x=0, y=0, z=0>',
    ].join('\n'));

    const system10 = tick(system0);
    expect(system10.toString()).toBe([
      'pos=<x=-9, y=-10, z=1>, vel=<x=-2, y=-2, z=-1>',
      'pos=<x=4, y=10, z=9>, vel=<x=-3, y=7, z=-2>',
      'pos=<x=8, y=-10, z=-3>, vel=<x=5, y=-1, z=-2>',
      'pos=<x=5, y=-10, z=3>, vel=<x=0, y=-4, z=5>',
    ].join('\n'));

    const system20 = tick(system10);
    expect(system20.toString()).toBe([
      'pos=<x=-10, y=3, z=-4>, vel=<x=-5, y=2, z=0>',
      'pos=<x=5, y=-25, z=6>, vel=<x=1, y=1, z=-4>',
      'pos=<x=13, y=1, z=1>, vel=<x=5, y=-2, z=2>',
      'pos=<x=0, y=1, z=7>, vel=<x=-1, y=-1, z=2>',
    ].join('\n'));

    const system30 = tick(system20);
    expect(system30.toString()).toBe([
      'pos=<x=15, y=-6, z=-9>, vel=<x=-5, y=4, z=0>',
      'pos=<x=-4, y=-11, z=3>, vel=<x=-3, y=-10, z=0>',
      'pos=<x=0, y=-1, z=11>, vel=<x=7, y=4, z=3>',
      'pos=<x=-3, y=-2, z=5>, vel=<x=1, y=2, z=-3>',
    ].join('\n'));

    const system40 = tick(system30);
    expect(system40.toString()).toBe([
      'pos=<x=14, y=-12, z=-4>, vel=<x=11, y=3, z=0>',
      'pos=<x=-1, y=18, z=8>, vel=<x=-5, y=2, z=3>',
      'pos=<x=-5, y=-14, z=8>, vel=<x=1, y=-2, z=0>',
      'pos=<x=0, y=-12, z=-2>, vel=<x=-7, y=-3, z=-3>',
    ].join('\n'));

    const system50 = tick(system40);
    expect(system50.toString()).toBe([
      'pos=<x=-23, y=4, z=1>, vel=<x=-7, y=-1, z=2>',
      'pos=<x=20, y=-31, z=13>, vel=<x=5, y=3, z=4>',
      'pos=<x=-4, y=6, z=1>, vel=<x=-1, y=1, z=-3>',
      'pos=<x=15, y=1, z=-5>, vel=<x=3, y=-3, z=-3>',
    ].join('\n'));

    const system60 = tick(system50);
    expect(system60.toString()).toBe([
      'pos=<x=36, y=-10, z=6>, vel=<x=5, y=0, z=3>',
      'pos=<x=-18, y=10, z=9>, vel=<x=-3, y=-7, z=5>',
      'pos=<x=8, y=-12, z=-3>, vel=<x=-2, y=1, z=-7>',
      'pos=<x=-18, y=-8, z=-2>, vel=<x=0, y=6, z=-1>',
    ].join('\n'));

    const system70 = tick(system60);
    expect(system70.toString()).toBe([
      'pos=<x=-33, y=-6, z=5>, vel=<x=-5, y=-4, z=7>',
      'pos=<x=13, y=-9, z=2>, vel=<x=-2, y=11, z=3>',
      'pos=<x=11, y=-8, z=2>, vel=<x=8, y=-6, z=-7>',
      'pos=<x=17, y=3, z=1>, vel=<x=-1, y=-1, z=-3>',
    ].join('\n'));

    const system80 = tick(system70);
    expect(system80.toString()).toBe([
      'pos=<x=30, y=-8, z=3>, vel=<x=3, y=3, z=0>',
      'pos=<x=-2, y=-4, z=0>, vel=<x=4, y=-13, z=2>',
      'pos=<x=-18, y=-7, z=15>, vel=<x=-8, y=2, z=-2>',
      'pos=<x=-2, y=-1, z=-8>, vel=<x=1, y=8, z=0>',
    ].join('\n'));

    const system90 = tick(system80);
    expect(system90.toString()).toBe([
      'pos=<x=-25, y=-1, z=4>, vel=<x=1, y=-3, z=4>',
      'pos=<x=2, y=-9, z=0>, vel=<x=-3, y=13, z=-1>',
      'pos=<x=32, y=-8, z=14>, vel=<x=5, y=-4, z=6>',
      'pos=<x=-1, y=-2, z=-8>, vel=<x=-3, y=-6, z=-9>',
    ].join('\n'));

    const system100 = tick(system90);
    expect(system100.toString()).toBe([
      'pos=<x=8, y=-12, z=-9>, vel=<x=-7, y=3, z=0>',
      'pos=<x=13, y=16, z=-3>, vel=<x=3, y=-11, z=-5>',
      'pos=<x=-29, y=-11, z=-1>, vel=<x=-3, y=7, z=4>',
      'pos=<x=16, y=-13, z=23>, vel=<x=7, y=1, z=1>',
    ].join('\n'));

    expect(system100.totalEnergy).toBe(1940);
  });

  it('finds number of steps to get back to initial state 1', () => {
    const system0 = new SatelliteSystemSnapshot([
      new Satellite({x: -1, y: 0, z: 2}),
      new Satellite({x: 2, y: -10, z: -7}),
      new Satellite({x: 4, y: -8, z: 8}),
      new Satellite({x: 3, y: 5, z: -1}),
    ]);

    const steps = findNumberOfStepsWhenPositionsAndVelocitiesAreTheSameAsAtTheBeginning(system0)

    expect(steps).toBe(2772);
  });

  it('finds number of steps to get back to initial state 2', () => {
    const system0 = new SatelliteSystemSnapshot([
      new Satellite({x: -8, y: -10, z: 0}),
      new Satellite({x: 5, y: 5, z: 10}),
      new Satellite({x: 2, y: -7, z: 3}),
      new Satellite({x: 9, y: -8, z: -3}),
    ]);

    const steps = findNumberOfStepsWhenPositionsAndVelocitiesAreTheSameAsAtTheBeginning(system0)

    expect(steps).toBe(4686774924);
  });
});
