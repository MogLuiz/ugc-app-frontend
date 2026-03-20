import { Star } from "lucide-react";
import type { CreatorProfile } from "../../types";

type CreatorTestimonialsSectionProps = {
  profile: CreatorProfile;
};

export function CreatorTestimonialsSection({
  profile,
}: CreatorTestimonialsSectionProps) {
  if (profile.testimonials.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4">
      <h3 className="text-lg font-bold text-[#0f172a] lg:text-xl">
        Depoimentos de Clientes
      </h3>
      <div className="flex flex-col gap-4">
        {profile.testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="rounded-[32px] border border-[#f1f5f9] bg-white p-5 lg:rounded-[48px]"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(137,90,246,0.2)] text-base font-bold text-[#895af6]">
                  {testimonial.authorInitials}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0f172a]">
                    {testimonial.authorName}
                  </p>
                  <p className="text-xs text-[#64748b]">
                    {testimonial.authorRole}
                  </p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: testimonial.rating }).map((_, index) => (
                  <Star
                    key={index}
                    className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
            </div>
            <p className="text-sm leading-5 text-[#475569]">{testimonial.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
