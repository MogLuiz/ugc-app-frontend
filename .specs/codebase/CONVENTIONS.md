# Code Conventions

## Naming Conventions

**Files:**

- kebab-case: `company-profile-screen.tsx`, `use-company-profile-controller.ts`
- Sections: `company-profile-sections.tsx`, `company-portfolio-section.tsx`
- Types: `types.ts` dentro do módulo

**Functions/Methods:**

- camelCase: `handleAvatarChange`, `handlePortfolioUpload`
- Handlers: prefixo `handle` (ex: `handleEdit`, `handleCancelEdit`)
- Hooks: prefixo `use` (ex: `useCompanyProfileController`)

**Variables:**

- camelCase: `displayName`, `portfolioMedia`, `isEditing`

**Constants:**

- UPPER_SNAKE ou camelCase para config: `MOCK_BUSINESS_STATS`, `ROLE_STORAGE_KEY`

## Code Organization

**Import/Dependency Declaration:**

- Ordem típica: React, libs externas, ~/components, ~/modules, ~/lib, tipos
- Exemplo de `company-profile-screen.tsx`:

```ts
import { useAuth } from "~/hooks/use-auth";
import { Link } from "react-router";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "~/components/ui/button";
import { AppSidebar } from "~/components/app-sidebar";
import { useCompanyProfileController } from "../hooks/use-company-profile-controller";
import { ... } from "./sections/company-profile-sections";
```

**File Structure:**

- Componentes: props tipadas no topo, helpers antes do componente, export nomeado
- Controllers: estado e mutations no topo, handlers no meio, return no final

## Type Safety/Documentation

**Approach:** TypeScript strict. Tipos explícitos em props e retornos de funções públicas.

**Example:**

```ts
type CompanyProfileFormSectionProps = CompanyProfileSectionProps & {
  errors: FieldErrors<CompanyProfileForm>;
  isSaving: boolean;
  register: UseFormRegister<CompanyProfileForm>;
  onSubmit: FormEventHandler<HTMLFormElement>;
};
```

## Error Handling

**Pattern:** `try/catch` em handlers assíncronos; `toast.error()` para feedback; `toast.success()` em sucesso.

**Example:**

```ts
try {
  await uploadAvatarMutation.mutateAsync({ file });
  toast.success(getCompanyProfileSuccessMessage("avatar_upload"));
} catch (error) {
  toast.error(getCompanyProfileErrorMessage(error, "avatar_upload"));
}
```

## Comments/Documentation

**Style:** Comentários em português quando necessário. JSDoc em funções públicas de lib. Evitar comentários óbvios.
