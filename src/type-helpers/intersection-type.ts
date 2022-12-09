import { Type } from '@nestjs/common';
import { inheritPropertyInitializers } from '@nestjs/mapped-types';
import { metadataStorage } from '../lib/storage';
import { IntersectionType as SwaggerIntersectionType } from '@nestjs/swagger';

export function IntersectionType<A>(classARef: A): Type<A>;
export function IntersectionType<A, B>(classARef: A, classBRef: B): Type<A & B>;
export function IntersectionType<A, B, C>(
  classARef: A,
  classBRef: B,
  classCRef: C,
): Type<A & B & C>;
export function IntersectionType<A, B, C, D>(
  classARef: A,
  classBRef: B,
  classCRef: C,
  classDRef: D,
): Type<A & B & C & D>;
export function IntersectionType<A, B, C, D, E>(
  classARef: A,
  classBRef: B,
  classCRef: C,
  classDRef: D,
  classERef: E,
): Type<A & B & C & D & E>;
export function IntersectionType<A, B, C, D, E, F>(
  classARef: A,
  classBRef: B,
  classCRef: C,
  classDRef: D,
  classERef: E,
  classFRef: F,
): Type<A & B & C & D & E & F>;
export function IntersectionType<A, B, C, D, E, F, G>(
  classARef: A,
  classBRef: B,
  classCRef: C,
  classDRef: D,
  classERef: E,
  classFRef: F,
  classGRef: G,
): Type<A & B & C & D & E & F & G>;
export function IntersectionType<A, B, C, D, E, F, G, H>(
  classARef: A,
  classBRef: B,
  classCRef: C,
  classDRef: D,
  classERef: E,
  classFRef: F,
  classGRef: G,
  classHRef: H,
): Type<A & B & C & D & E & F & G & H>;
export function IntersectionType<A, B, C, D, E, F, G, H, I>(
  classARef: A,
  classBRef: B,
  classCRef: C,
  classDRef: D,
  classERef: E,
  classFRef: F,
  classGRef: G,
  classHRef: H,
  classIRef: I,
): Type<A & B & C & D & E & F & G & H & I>;
export function IntersectionType<A, B, C, D, E, F, G, H, I, J>(
  classARef: A,
  classBRef: B,
  classCRef: C,
  classDRef: D,
  classERef: E,
  classFRef: F,
  classGRef: G,
  classHRef: H,
  classIRef: I,
  classJRef: J,
): Type<A & B & C & D & E & F & G & H & I & J>;
export function IntersectionType<A, B, C, D, E, F, G, H, I, J, K>(
  classARef: A,
  classBRef: B,
  classCRef: C,
  classDRef: D,
  classERef: E,
  classFRef: F,
  classGRef: G,
  classHRef: H,
  classIRef: I,
  classJRef: J,
  classKRef: K,
): Type<A & B & C & D & E & F & G & H & I & J & K>;
export function IntersectionType<A, B, C, D, E, F, G, H, I, J, K, L>(
  classARef: A,
  classBRef: B,
  classCRef: C,
  classDRef: D,
  classERef: E,
  classFRef: F,
  classGRef: G,
  classHRef: H,
  classIRef: I,
  classJRef: J,
  classKRef: K,
  classLRef: L,
): Type<A & B & C & D & E & F & G & H & I & J & K & L>;
export function IntersectionType<A, B, C, D, E, F, G, H, I, J, K, L, M>(
  classARef: A,
  classBRef: B,
  classCRef: C,
  classDRef: D,
  classERef: E,
  classFRef: F,
  classGRef: G,
  classHRef: H,
  classIRef: I,
  classJRef: J,
  classKRef: K,
  classLRef: L,
  classMRef: M,
): Type<A & B & C & D & E & F & G & H & I & J & K & L & M>;
export function IntersectionType<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
  classARef: A,
  classBRef: B,
  classCRef: C,
  classDRef: D,
  classERef: E,
  classFRef: F,
  classGRef: G,
  classHRef: H,
  classIRef: I,
  classJRef: J,
  classKRef: K,
  classLRef: L,
  classMRef: M,
  classNRef: N,
): Type<A & B & C & D & E & F & G & H & I & J & K & L & M & N>;
export function IntersectionType<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
  classARef: A,
  classBRef: B,
  classCRef: C,
  classDRef: D,
  classERef: E,
  classFRef: F,
  classGRef: G,
  classHRef: H,
  classIRef: I,
  classJRef: J,
  classKRef: K,
  classLRef: L,
  classMRef: M,
  classNRef: N,
  classORef: O,
): Type<A & B & C & D & E & F & G & H & I & J & K & L & M & N & O>;
export function IntersectionType<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
  classARef: A,
  classBRef: B,
  classCRef: C,
  classDRef: D,
  classERef: E,
  classFRef: F,
  classGRef: G,
  classHRef: H,
  classIRef: I,
  classJRef: J,
  classKRef: K,
  classLRef: L,
  classMRef: M,
  classNRef: N,
  classORef: O,
  classPRef: P,
): Type<A & B & C & D & E & F & G & H & I & J & K & L & M & N & O & P>;
export function IntersectionType<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q>(
  classARef: A,
  classBRef: B,
  classCRef: C,
  classDRef: D,
  classERef: E,
  classFRef: F,
  classGRef: G,
  classHRef: H,
  classIRef: I,
  classJRef: J,
  classKRef: K,
  classLRef: L,
  classMRef: M,
  classNRef: N,
  classORef: O,
  classPRef: P,
  classQRef: Q,
): Type<A & B & C & D & E & F & G & H & I & J & K & L & M & N & O & P & Q>;
export function IntersectionType<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R>(
  classARef: A,
  classBRef: B,
  classCRef: C,
  classDRef: D,
  classERef: E,
  classFRef: F,
  classGRef: G,
  classHRef: H,
  classIRef: I,
  classJRef: J,
  classKRef: K,
  classLRef: L,
  classMRef: M,
  classNRef: N,
  classORef: O,
  classPRef: P,
  classQRef: Q,
  classRRef: R,
): Type<A & B & C & D & E & F & G & H & I & J & K & L & M & N & O & P & Q & R>;
export function IntersectionType<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S>(
  classARef: A,
  classBRef: B,
  classCRef: C,
  classDRef: D,
  classERef: E,
  classFRef: F,
  classGRef: G,
  classHRef: H,
  classIRef: I,
  classJRef: J,
  classKRef: K,
  classLRef: L,
  classMRef: M,
  classNRef: N,
  classORef: O,
  classPRef: P,
  classQRef: Q,
  classRRef: R,
  classSRef: S,
): Type<A & B & C & D & E & F & G & H & I & J & K & L & M & N & O & P & Q & R & S>;
export function IntersectionType<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T>(
  classARef: A,
  classBRef: B,
  classCRef: C,
  classDRef: D,
  classERef: E,
  classFRef: F,
  classGRef: G,
  classHRef: H,
  classIRef: I,
  classJRef: J,
  classKRef: K,
  classLRef: L,
  classMRef: M,
  classNRef: N,
  classORef: O,
  classPRef: P,
  classQRef: Q,
  classRRef: R,
  classSRef: S,
  classTRef: T,
): Type<A & B & C & D & E & F & G & H & I & J & K & L & M & N & O & P & Q & R & S & T>;
export function IntersectionType<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U>(
  classARef: A,
  classBRef: B,
  classCRef: C,
  classDRef: D,
  classERef: E,
  classFRef: F,
  classGRef: G,
  classHRef: H,
  classIRef: I,
  classJRef: J,
  classKRef: K,
  classLRef: L,
  classMRef: M,
  classNRef: N,
  classORef: O,
  classPRef: P,
  classQRef: Q,
  classRRef: R,
  classSRef: S,
  classTRef: T,
  classURef: U,
): Type<A & B & C & D & E & F & G & H & I & J & K & L & M & N & O & P & Q & R & S & T & U>;
export function IntersectionType<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V>(
  classARef: A,
  classBRef: B,
  classCRef: C,
  classDRef: D,
  classERef: E,
  classFRef: F,
  classGRef: G,
  classHRef: H,
  classIRef: I,
  classJRef: J,
  classKRef: K,
  classLRef: L,
  classMRef: M,
  classNRef: N,
  classORef: O,
  classPRef: P,
  classQRef: Q,
  classRRef: R,
  classSRef: S,
  classTRef: T,
  classURef: U,
  classVRef: V,
): Type<A & B & C & D & E & F & G & H & I & J & K & L & M & N & O & P & Q & R & S & T & U & V>;
export function IntersectionType<
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N,
  O,
  P,
  Q,
  R,
  S,
  T,
  U,
  V,
  W,
>(
  classARef: A,
  classBRef: B,
  classCRef: C,
  classDRef: D,
  classERef: E,
  classFRef: F,
  classGRef: G,
  classHRef: H,
  classIRef: I,
  classJRef: J,
  classKRef: K,
  classLRef: L,
  classMRef: M,
  classNRef: N,
  classORef: O,
  classPRef: P,
  classQRef: Q,
  classRRef: R,
  classSRef: S,
  classTRef: T,
  classURef: U,
  classVRef: V,
  classWRef: W,
): Type<A & B & C & D & E & F & G & H & I & J & K & L & M & N & O & P & Q & R & S & T & U & V & W>;
export function IntersectionType<
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N,
  O,
  P,
  Q,
  R,
  S,
  T,
  U,
  V,
  W,
  X,
>(
  classARef: A,
  classBRef: B,
  classCRef: C,
  classDRef: D,
  classERef: E,
  classFRef: F,
  classGRef: G,
  classHRef: H,
  classIRef: I,
  classJRef: J,
  classKRef: K,
  classLRef: L,
  classMRef: M,
  classNRef: N,
  classORef: O,
  classPRef: P,
  classQRef: Q,
  classRRef: R,
  classSRef: S,
  classTRef: T,
  classURef: U,
  classVRef: V,
  classWRef: W,
  classXRef: X,
): Type<
  A & B & C & D & E & F & G & H & I & J & K & L & M & N & O & P & Q & R & S & T & U & V & W & X
>;
export function IntersectionType<
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N,
  O,
  P,
  Q,
  R,
  S,
  T,
  U,
  V,
  W,
  X,
  Y,
>(
  classARef: A,
  classBRef: B,
  classCRef: C,
  classDRef: D,
  classERef: E,
  classFRef: F,
  classGRef: G,
  classHRef: H,
  classIRef: I,
  classJRef: J,
  classKRef: K,
  classLRef: L,
  classMRef: M,
  classNRef: N,
  classORef: O,
  classPRef: P,
  classQRef: Q,
  classRRef: R,
  classSRef: S,
  classTRef: T,
  classURef: U,
  classVRef: V,
  classWRef: W,
  classXRef: X,
  classYRef: Y,
): Type<
  A & B & C & D & E & F & G & H & I & J & K & L & M & N & O & P & Q & R & S & T & U & V & W & X & Y
>;
export function IntersectionType<
  A,
  B,
  C,
  D,
  E,
  F,
  G,
  H,
  I,
  J,
  K,
  L,
  M,
  N,
  O,
  P,
  Q,
  R,
  S,
  T,
  U,
  V,
  W,
  X,
  Y,
  Z,
>(
  classARef: A,
  classBRef: B,
  classCRef: C,
  classDRef: D,
  classERef: E,
  classFRef: F,
  classGRef: G,
  classHRef: H,
  classIRef: I,
  classJRef: J,
  classKRef: K,
  classLRef: L,
  classMRef: M,
  classNRef: N,
  classORef: O,
  classPRef: P,
  classQRef: Q,
  classRRef: R,
  classSRef: S,
  classTRef: T,
  classURef: U,
  classVRef: V,
  classWRef: W,
  classXRef: X,
  classYRef: Y,
  classZRef: Z,
): Type<
  A &
    B &
    C &
    D &
    E &
    F &
    G &
    H &
    I &
    J &
    K &
    L &
    M &
    N &
    O &
    P &
    Q &
    R &
    S &
    T &
    U &
    V &
    W &
    X &
    Y &
    Z
>;
export function IntersectionType(...classRefs: Type[]) {
  abstract class IntersectionTypeClass {
    constructor() {
      classRefs.forEach((classRef) => {
        inheritPropertyInitializers(this, classRef);
      });
    }
  }

  const words: string[] = ['_IntersectionType'];
  let lastClass = null;

  for (const classRef of classRefs) {
    words.push(classRef.name);
  }

  Object.defineProperty(IntersectionTypeClass, 'name', {
    value: words.join('_'),
  });

  for (const classRef of classRefs) {
    metadataStorage.copyProps(classRef, IntersectionTypeClass);
    if (lastClass !== null) {
      lastClass = SwaggerIntersectionType(lastClass, classRef);
    } else {
      lastClass = classRef;
    }
  }

  return IntersectionTypeClass;
}
