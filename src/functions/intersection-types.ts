import { Type } from '@nestjs/common';
import { IntersectionType } from './intersection-type';

export function IntersectTwoTypes<A, B>(
  target: string,
  classARef: Type<A>,
  classBRef: Type<B>,
): Type<A & B> {
  return IntersectionType(target, classARef, classBRef);
}

export function IntersectThreeTypes<A, B, C>(
  target: string,
  classARef: Type<A>,
  classBRef: Type<B>,
  classCRef: Type<C>,
): Type<A & B & C> {
  return IntersectionType(target, IntersectTwoTypes(target, classARef, classBRef), classCRef);
}

export function IntersectFourTypes<A, B, C, D>(
  target: string,
  classARef: Type<A>,
  classBRef: Type<B>,
  classCRef: Type<C>,
  classDRef: Type<D>,
): Type<A & B & C & D> {
  return IntersectionType(
    target,
    IntersectThreeTypes(target, classARef, classBRef, classCRef),
    classDRef,
  );
}

export function IntersectFiveTypes<A, B, C, D, E>(
  target: string,
  classARef: Type<A>,
  classBRef: Type<B>,
  classCRef: Type<C>,
  classDRef: Type<D>,
  classERef: Type<E>,
): Type<A & B & C & D & E> {
  return IntersectionType(
    target,
    IntersectFourTypes(target, classARef, classBRef, classCRef, classDRef),
    classERef,
  );
}

export function IntersectSixTypes<A, B, C, D, E, F>(
  target: string,
  classARef: Type<A>,
  classBRef: Type<B>,
  classCRef: Type<C>,
  classDRef: Type<D>,
  classERef: Type<E>,
  classFRef: Type<F>,
): Type<A & B & C & D & E & F> {
  return IntersectionType(
    target,
    IntersectFiveTypes(target, classARef, classBRef, classCRef, classDRef, classERef),
    classFRef,
  );
}

export function IntersectSevenTypes<A, B, C, D, E, F, G>(
  target: string,
  classARef: Type<A>,
  classBRef: Type<B>,
  classCRef: Type<C>,
  classDRef: Type<D>,
  classERef: Type<E>,
  classFRef: Type<F>,
  classGRef: Type<G>,
): Type<A & B & C & D & E & F & G> {
  return IntersectionType(
    target,
    IntersectSixTypes(target, classARef, classBRef, classCRef, classDRef, classERef, classFRef),
    classGRef,
  );
}

export function IntersectEightTypes<A, B, C, D, E, F, G, H>(
  target: string,
  classARef: Type<A>,
  classBRef: Type<B>,
  classCRef: Type<C>,
  classDRef: Type<D>,
  classERef: Type<E>,
  classFRef: Type<F>,
  classGRef: Type<G>,
  classHRef: Type<H>,
): Type<A & B & C & D & E & F & G & H> {
  return IntersectionType(
    target,
    IntersectSevenTypes(
      target,
      classARef,
      classBRef,
      classCRef,
      classDRef,
      classERef,
      classFRef,
      classGRef,
    ),
    classHRef,
  );
}

export function IntersectNineTypes<A, B, C, D, E, F, G, H, I>(
  target: string,
  classARef: Type<A>,
  classBRef: Type<B>,
  classCRef: Type<C>,
  classDRef: Type<D>,
  classERef: Type<E>,
  classFRef: Type<F>,
  classGRef: Type<G>,
  classHRef: Type<H>,
  classIRef: Type<I>,
): Type<A & B & C & D & E & F & G & H & I> {
  return IntersectionType(
    target,
    IntersectEightTypes(
      target,
      classARef,
      classBRef,
      classCRef,
      classDRef,
      classERef,
      classFRef,
      classGRef,
      classHRef,
    ),
    classIRef,
  );
}

export function IntersectTenTypes<A, B, C, D, E, F, G, H, I, J>(
  target: string,
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
): Type<A & B & C & D & E & F & G & H & I & J> {
  return IntersectionType(
    target,
    IntersectNineTypes(
      target,
      classARef,
      classBRef,
      classCRef,
      classDRef,
      classERef,
      classFRef,
      classGRef,
      classHRef,
      classIRef,
    ),
    classJRef,
  );
}
