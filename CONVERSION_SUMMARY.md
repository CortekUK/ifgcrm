# Sheet to Dialog Conversion Summary

This document tracks the conversion of Sheet components to Dialog components across the IFG CRM application.

## Completed Conversions

1. ✅ components/campaigns/campaign-drawer.tsx
2. ✅ components/templates/template-drawer.tsx
3. ✅ components/templates/template-preview.tsx
4. ✅ components/settings/programmes-panel.tsx

## In Progress

Converting remaining files...

## Conversion Pattern

For each file, the following changes are made:

### Import Changes
```typescript
// Before
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"

// After
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
```

### Component Structure
```typescript
// Before
<Sheet open={open} onOpenChange={onClose}>
  <SheetContent className="w-full overflow-y-auto sm:max-w-[520px]">
    <SheetHeader>
      <SheetTitle>Title</SheetTitle>
    </SheetHeader>
    <div className="mt-6 space-y-4">
      {/* content */}
    </div>
  </SheetContent>
</Sheet>

// After
<Dialog open={open} onOpenChange={onClose}>
  <DialogContent className="max-w-[520px] max-h-[85vh] overflow-hidden p-0 flex flex-col">
    <div className="px-6 pt-6 pb-4 border-b">
      <DialogHeader>
        <DialogTitle>Title</DialogTitle>
      </DialogHeader>
    </div>
    <div className="overflow-y-auto px-6 py-4 space-y-4">
      {/* content */}
    </div>
  </DialogContent>
</Dialog>
```
