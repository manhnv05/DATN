package com.example.datn.utils;

import com.example.datn.VO.AbstractFilterRequest;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
public class GenericSpecificationBuilder<T> {

    public Specification<T> buildSpecification(AbstractFilterRequest filterRequest, FilterCriteriaMapper mapper) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            // Filter by name
            Optional.ofNullable(filterRequest.getFilterByName())
                    .filter(StringUtils::hasLength)
                    .map(String::toLowerCase)
                    .ifPresent(name ->
                            predicates.add(cb.like(
                                    cb.lower(root.get(mapper.getNameField())),//employeeName || customerName
                                    "%" + name + "%"
                            ))
                    );

            // Filter by gender
            Optional.ofNullable(filterRequest.getFilterByGender())
                    .ifPresent(gender ->
                            predicates.add(cb.equal(root.get(mapper.getGenderField()), gender))
                    );

            // Filter by status
            Optional.ofNullable(filterRequest.getFilterByStatus())
                    .ifPresent(status ->
                            predicates.add(cb.equal(root.get(mapper.getStatusField()), status))
                    );

            // Filter by phone number
            Optional.ofNullable(filterRequest.getFilterByPhoneNumber())
                    .filter(StringUtils::hasLength)
                    .ifPresent(phone ->
                            predicates.add(cb.like(
                                    root.get(mapper.getPhoneNumberField()),
                                    "%" + phone + "%"
                            ))
                    );

            // Filter by min age
            Optional.ofNullable(filterRequest.getMinAge())
                    .ifPresent(minAge ->
                            predicates.add(buildMinAgePredicate(root, cb, minAge, mapper.getBirthDateField()))
                    );
            // Filter by max age
            Optional.ofNullable(filterRequest.getMaxAge())
                    .ifPresent(maxAge ->
                            predicates.add(buildMaxAgePredicate(root, cb, maxAge, mapper.getBirthDateField()))
                    );

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private Predicate buildMinAgePredicate(Root<T> root, CriteriaBuilder cb, Integer minAge, String birthDateField) {
        Expression<Integer> currentYear = cb.function("YEAR", Integer.class, cb.currentDate());
        Expression<Integer> birthYear = cb.function("YEAR", Integer.class, root.get(birthDateField));
        Expression<Integer> age = cb.diff(currentYear, birthYear);
        return cb.greaterThanOrEqualTo(age, minAge);
    }

    private Predicate buildMaxAgePredicate(Root<T> root, CriteriaBuilder cb, Integer maxAge, String birthDateField) {
        Expression<Integer> currentYear = cb.function("YEAR", Integer.class, cb.currentDate());
        Expression<Integer> birthYear = cb.function("YEAR", Integer.class, root.get(birthDateField));
        Expression<Integer> age = cb.diff(currentYear, birthYear);
        return cb.lessThanOrEqualTo(age, maxAge);
    }

}
