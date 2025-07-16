import { IPopulateVirtualsRef } from '@shared/application/types/mongoose.types';
import { ObjectId } from 'bson';
import { forEach, get, first, isEmpty, omit, map, assign, every, isPlainObject, isArray } from 'lodash';
import { Document } from 'mongoose';

export function populateVirtualsUtil<Entity extends object>(
  refs: IPopulateVirtualsRef[] = [],
  fieldsToOmitFromRoot: string[] = ['id'],
): (this: Document) => Partial<Entity> {
  //should refactor to decrease complexity someday and avoid code duplication
  return function (this: Document): Partial<Entity> {
    const document = this.toJSON({ virtuals: true });
    forEach(
      refs,
      ({
        name,
        shouldKeepAsArray = false,
        fieldsToOmitFromRef = ['id'],
        nestedRefs,
        mergeRefObjIntoRootObj = false,
      }) => {
        let ref = get(document, name);
        const allObjectIds = isEmpty(ref)
          ? false
          : every(ref, (item) => !isPlainObject(item) && !isArray(item) && ObjectId.isValid(item));
        if (!allObjectIds) {
          if (!shouldKeepAsArray) ref = first(ref);
          if (!isEmpty(ref)) {
            document[name] = shouldKeepAsArray
              ? map(ref, (item) =>
                  nestedRefs
                    ? handleNestedRef(omit(item, fieldsToOmitFromRef), nestedRefs)
                    : omit(item, fieldsToOmitFromRef),
                )
              : nestedRefs
              ? handleNestedRef(omit(ref, fieldsToOmitFromRef), nestedRefs)
              : omit(ref, fieldsToOmitFromRef);
          } else {
            delete document[name];
          }

          if (mergeRefObjIntoRootObj) {
            assign(document, document[name]);
            delete document[name];
          }
        }
      },
    );

    const result = omit<Entity>(document, fieldsToOmitFromRoot);

    return result;
  };
}

export function handleNestedRef<Entity>(document: Entity, refs: IPopulateVirtualsRef[] = []): Partial<Entity> {
  forEach(
    refs,
    ({ name, shouldKeepAsArray = false, fieldsToOmitFromRef = ['id'], nestedRefs, mergeRefObjIntoRootObj = false }) => {
      let ref = get(document, name);
      if (!shouldKeepAsArray) ref = first(ref);
      if (!isEmpty(ref)) {
        document[name] = shouldKeepAsArray
          ? map(ref, (item) =>
              nestedRefs
                ? handleNestedRef(omit(item, fieldsToOmitFromRef), nestedRefs)
                : omit(item, fieldsToOmitFromRef),
            )
          : nestedRefs
          ? handleNestedRef(omit(ref, fieldsToOmitFromRef), nestedRefs)
          : omit(ref, fieldsToOmitFromRef);
      } else {
        delete document[name];
      }

      if (mergeRefObjIntoRootObj) {
        assign(document, document[name]);
        delete document[name];
      }
    },
  );
  return document;
}
