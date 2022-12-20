import { Type } from '@nestjs/common';
import { IntersectionType as NestJSSwaggerIntersectionType } from '@nestjs/swagger';
import { _MetadataStorageV1 } from '../../libs';

export function $IntersectionType<A, B>(classARef: Type<A>, classBRef: Type<B>): Type<A & B>;
export function $IntersectionType<A, B, C>(
  classARef: Type<A>,
  classBRef: Type<B>,
  classCRef: Type<C>,
): Type<A & B & C>;
export function $IntersectionType<A, B, C, D>(
  classARef: Type<A>,
  classBRef: Type<B>,
  classCRef: Type<C>,
  classDRef: Type<D>,
): Type<A & B & C & D>;
export function $IntersectionType<A, B, C, D, E>(
  classARef: Type<A>,
  classBRef: Type<B>,
  classCRef: Type<C>,
  classDRef: Type<D>,
  classERef: Type<E>,
): Type<A & B & C & D & E>;
export function $IntersectionType<A, B, C, D, E, F>(
  classARef: Type<A>,
  classBRef: Type<B>,
  classCRef: Type<C>,
  classDRef: Type<D>,
  classERef: Type<E>,
  classFRef: Type<F>,
): Type<A & B & C & D & E & F>;
export function $IntersectionType<A, B, C, D, E, F, G>(
  classARef: Type<A>,
  classBRef: Type<B>,
  classCRef: Type<C>,
  classDRef: Type<D>,
  classERef: Type<E>,
  classFRef: Type<F>,
  classGRef: Type<G>,
): Type<A & B & C & D & E & F & G>;
export function $IntersectionType<A, B, C, D, E, F, G, H>(
  classARef: Type<A>,
  classBRef: Type<B>,
  classCRef: Type<C>,
  classDRef: Type<D>,
  classERef: Type<E>,
  classFRef: Type<F>,
  classGRef: Type<G>,
  classHRef: Type<H>,
): Type<A & B & C & D & E & F & G & H>;
export function $IntersectionType<A, B, C, D, E, F, G, H, I>(
  classARef: Type<A>,
  classBRef: Type<B>,
  classCRef: Type<C>,
  classDRef: Type<D>,
  classERef: Type<E>,
  classFRef: Type<F>,
  classGRef: Type<G>,
  classHRef: Type<H>,
  classIRef: Type<I>,
): Type<A & B & C & D & E & F & G & H & I>;
export function $IntersectionType<A, B, C, D, E, F, G, H, I, J>(
  classARef: Type<A>,
  classBRef: Type<B>,
  classCRef: Type<C>,
  classDRef: Type<D>,
  classERef: Type<E>,
  classFRef: Type<F>,
  classGRef: Type<G>,
  classHRef: Type<H>,
  classIRef: Type<I>,
  classJRef: Type<J>,
): Type<A & B & C & D & E & F & G & H & I & J>;
export function $IntersectionType<A, B, C, D, E, F, G, H, I, J, K>(
  classARef: Type<A>,
  classBRef: Type<B>,
  classCRef: Type<C>,
  classDRef: Type<D>,
  classERef: Type<E>,
  classFRef: Type<F>,
  classGRef: Type<G>,
  classHRef: Type<H>,
  classIRef: Type<I>,
  classJRef: Type<J>,
  classKRef: Type<K>,
): Type<A & B & C & D & E & F & G & H & I & J & K>;
export function $IntersectionType<A, B, C, D, E, F, G, H, I, J, K, L>(
  classARef: Type<A>,
  classBRef: Type<B>,
  classCRef: Type<C>,
  classDRef: Type<D>,
  classERef: Type<E>,
  classFRef: Type<F>,
  classGRef: Type<G>,
  classHRef: Type<H>,
  classIRef: Type<I>,
  classJRef: Type<J>,
  classKRef: Type<K>,
  classLRef: Type<L>,
): Type<A & B & C & D & E & F & G & H & I & J & K & L>;
export function $IntersectionType<A, B, C, D, E, F, G, H, I, J, K, L, M>(
  classARef: Type<A>,
  classBRef: Type<B>,
  classCRef: Type<C>,
  classDRef: Type<D>,
  classERef: Type<E>,
  classFRef: Type<F>,
  classGRef: Type<G>,
  classHRef: Type<H>,
  classIRef: Type<I>,
  classJRef: Type<J>,
  classKRef: Type<K>,
  classLRef: Type<L>,
  classMRef: Type<M>,
): Type<A & B & C & D & E & F & G & H & I & J & K & L & M>;
export function $IntersectionType<A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
  classARef: Type<A>,
  classBRef: Type<B>,
  classCRef: Type<C>,
  classDRef: Type<D>,
  classERef: Type<E>,
  classFRef: Type<F>,
  classGRef: Type<G>,
  classHRef: Type<H>,
  classIRef: Type<I>,
  classJRef: Type<J>,
  classKRef: Type<K>,
  classLRef: Type<L>,
  classMRef: Type<M>,
  classNRef: Type<N>,
): Type<A & B & C & D & E & F & G & H & I & J & K & L & M & N>;
export function $IntersectionType<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
  classARef: Type<A>,
  classBRef: Type<B>,
  classCRef: Type<C>,
  classDRef: Type<D>,
  classERef: Type<E>,
  classFRef: Type<F>,
  classGRef: Type<G>,
  classHRef: Type<H>,
  classIRef: Type<I>,
  classJRef: Type<J>,
  classKRef: Type<K>,
  classLRef: Type<L>,
  classMRef: Type<M>,
  classNRef: Type<N>,
  classORef: Type<O>,
): Type<A & B & C & D & E & F & G & H & I & J & K & L & M & N & O>;
export function $IntersectionType<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P>(
  classARef: Type<A>,
  classBRef: Type<B>,
  classCRef: Type<C>,
  classDRef: Type<D>,
  classERef: Type<E>,
  classFRef: Type<F>,
  classGRef: Type<G>,
  classHRef: Type<H>,
  classIRef: Type<I>,
  classJRef: Type<J>,
  classKRef: Type<K>,
  classLRef: Type<L>,
  classMRef: Type<M>,
  classNRef: Type<N>,
  classORef: Type<O>,
  classPRef: Type<P>,
): Type<A & B & C & D & E & F & G & H & I & J & K & L & M & N & O & P>;
export function $IntersectionType<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q>(
  classARef: Type<A>,
  classBRef: Type<B>,
  classCRef: Type<C>,
  classDRef: Type<D>,
  classERef: Type<E>,
  classFRef: Type<F>,
  classGRef: Type<G>,
  classHRef: Type<H>,
  classIRef: Type<I>,
  classJRef: Type<J>,
  classKRef: Type<K>,
  classLRef: Type<L>,
  classMRef: Type<M>,
  classNRef: Type<N>,
  classORef: Type<O>,
  classPRef: Type<P>,
  classQRef: Type<Q>,
): Type<A & B & C & D & E & F & G & H & I & J & K & L & M & N & O & P & Q>;
export function $IntersectionType<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R>(
  classARef: Type<A>,
  classBRef: Type<B>,
  classCRef: Type<C>,
  classDRef: Type<D>,
  classERef: Type<E>,
  classFRef: Type<F>,
  classGRef: Type<G>,
  classHRef: Type<H>,
  classIRef: Type<I>,
  classJRef: Type<J>,
  classKRef: Type<K>,
  classLRef: Type<L>,
  classMRef: Type<M>,
  classNRef: Type<N>,
  classORef: Type<O>,
  classPRef: Type<P>,
  classQRef: Type<Q>,
  classRRef: Type<R>,
): Type<A & B & C & D & E & F & G & H & I & J & K & L & M & N & O & P & Q & R>;
export function $IntersectionType<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S>(
  classARef: Type<A>,
  classBRef: Type<B>,
  classCRef: Type<C>,
  classDRef: Type<D>,
  classERef: Type<E>,
  classFRef: Type<F>,
  classGRef: Type<G>,
  classHRef: Type<H>,
  classIRef: Type<I>,
  classJRef: Type<J>,
  classKRef: Type<K>,
  classLRef: Type<L>,
  classMRef: Type<M>,
  classNRef: Type<N>,
  classORef: Type<O>,
  classPRef: Type<P>,
  classQRef: Type<Q>,
  classRRef: Type<R>,
  classSRef: Type<S>,
): Type<A & B & C & D & E & F & G & H & I & J & K & L & M & N & O & P & Q & R & S>;
export function $IntersectionType<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T>(
  classARef: Type<A>,
  classBRef: Type<B>,
  classCRef: Type<C>,
  classDRef: Type<D>,
  classERef: Type<E>,
  classFRef: Type<F>,
  classGRef: Type<G>,
  classHRef: Type<H>,
  classIRef: Type<I>,
  classJRef: Type<J>,
  classKRef: Type<K>,
  classLRef: Type<L>,
  classMRef: Type<M>,
  classNRef: Type<N>,
  classORef: Type<O>,
  classPRef: Type<P>,
  classQRef: Type<Q>,
  classRRef: Type<R>,
  classSRef: Type<S>,
  classTRef: Type<T>,
): Type<A & B & C & D & E & F & G & H & I & J & K & L & M & N & O & P & Q & R & S & T>;
export function $IntersectionType<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U>(
  classARef: Type<A>,
  classBRef: Type<B>,
  classCRef: Type<C>,
  classDRef: Type<D>,
  classERef: Type<E>,
  classFRef: Type<F>,
  classGRef: Type<G>,
  classHRef: Type<H>,
  classIRef: Type<I>,
  classJRef: Type<J>,
  classKRef: Type<K>,
  classLRef: Type<L>,
  classMRef: Type<M>,
  classNRef: Type<N>,
  classORef: Type<O>,
  classPRef: Type<P>,
  classQRef: Type<Q>,
  classRRef: Type<R>,
  classSRef: Type<S>,
  classTRef: Type<T>,
  classURef: Type<U>,
): Type<A & B & C & D & E & F & G & H & I & J & K & L & M & N & O & P & Q & R & S & T & U>;
export function $IntersectionType<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V>(
  classARef: Type<A>,
  classBRef: Type<B>,
  classCRef: Type<C>,
  classDRef: Type<D>,
  classERef: Type<E>,
  classFRef: Type<F>,
  classGRef: Type<G>,
  classHRef: Type<H>,
  classIRef: Type<I>,
  classJRef: Type<J>,
  classKRef: Type<K>,
  classLRef: Type<L>,
  classMRef: Type<M>,
  classNRef: Type<N>,
  classORef: Type<O>,
  classPRef: Type<P>,
  classQRef: Type<Q>,
  classRRef: Type<R>,
  classSRef: Type<S>,
  classTRef: Type<T>,
  classURef: Type<U>,
  classVRef: Type<V>,
): Type<A & B & C & D & E & F & G & H & I & J & K & L & M & N & O & P & Q & R & S & T & U & V>;
export function $IntersectionType<
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
  classARef: Type<A>,
  classBRef: Type<B>,
  classCRef: Type<C>,
  classDRef: Type<D>,
  classERef: Type<E>,
  classFRef: Type<F>,
  classGRef: Type<G>,
  classHRef: Type<H>,
  classIRef: Type<I>,
  classJRef: Type<J>,
  classKRef: Type<K>,
  classLRef: Type<L>,
  classMRef: Type<M>,
  classNRef: Type<N>,
  classORef: Type<O>,
  classPRef: Type<P>,
  classQRef: Type<Q>,
  classRRef: Type<R>,
  classSRef: Type<S>,
  classTRef: Type<T>,
  classURef: Type<U>,
  classVRef: Type<V>,
  classWRef: Type<W>,
): Type<A & B & C & D & E & F & G & H & I & J & K & L & M & N & O & P & Q & R & S & T & U & V & W>;
export function $IntersectionType<
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
  classARef: Type<A>,
  classBRef: Type<B>,
  classCRef: Type<C>,
  classDRef: Type<D>,
  classERef: Type<E>,
  classFRef: Type<F>,
  classGRef: Type<G>,
  classHRef: Type<H>,
  classIRef: Type<I>,
  classJRef: Type<J>,
  classKRef: Type<K>,
  classLRef: Type<L>,
  classMRef: Type<M>,
  classNRef: Type<N>,
  classORef: Type<O>,
  classPRef: Type<P>,
  classQRef: Type<Q>,
  classRRef: Type<R>,
  classSRef: Type<S>,
  classTRef: Type<T>,
  classURef: Type<U>,
  classVRef: Type<V>,
  classWRef: Type<W>,
  classXRef: Type<X>,
): Type<
  A & B & C & D & E & F & G & H & I & J & K & L & M & N & O & P & Q & R & S & T & U & V & W & X
>;
export function $IntersectionType<
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
  classARef: Type<A>,
  classBRef: Type<B>,
  classCRef: Type<C>,
  classDRef: Type<D>,
  classERef: Type<E>,
  classFRef: Type<F>,
  classGRef: Type<G>,
  classHRef: Type<H>,
  classIRef: Type<I>,
  classJRef: Type<J>,
  classKRef: Type<K>,
  classLRef: Type<L>,
  classMRef: Type<M>,
  classNRef: Type<N>,
  classORef: Type<O>,
  classPRef: Type<P>,
  classQRef: Type<Q>,
  classRRef: Type<R>,
  classSRef: Type<S>,
  classTRef: Type<T>,
  classURef: Type<U>,
  classVRef: Type<V>,
  classWRef: Type<W>,
  classXRef: Type<X>,
  classYRef: Type<Y>,
): Type<
  A & B & C & D & E & F & G & H & I & J & K & L & M & N & O & P & Q & R & S & T & U & V & W & X & Y
>;
export function $IntersectionType<
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
  classARef: Type<A>,
  classBRef: Type<B>,
  classCRef: Type<C>,
  classDRef: Type<D>,
  classERef: Type<E>,
  classFRef: Type<F>,
  classGRef: Type<G>,
  classHRef: Type<H>,
  classIRef: Type<I>,
  classJRef: Type<J>,
  classKRef: Type<K>,
  classLRef: Type<L>,
  classMRef: Type<M>,
  classNRef: Type<N>,
  classORef: Type<O>,
  classPRef: Type<P>,
  classQRef: Type<Q>,
  classRRef: Type<R>,
  classSRef: Type<S>,
  classTRef: Type<T>,
  classURef: Type<U>,
  classVRef: Type<V>,
  classWRef: Type<W>,
  classXRef: Type<X>,
  classYRef: Type<Y>,
  classZRef: Type<Z>,
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
export function $IntersectionType(...classRefs: Type[]) {
  let classARef = null;
  let resultClass = null;
  for (const classBRef of classRefs) {
    if (classARef === null) {
      classARef = classBRef;
    } else {
      resultClass = NestJSSwaggerIntersectionType(classARef, classBRef);
      _MetadataStorageV1.copyProps(classARef, resultClass);
      _MetadataStorageV1.copyProps(classBRef, resultClass);
      classARef = resultClass;
    }
  }
  return resultClass;
}
