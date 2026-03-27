import os
import re

mappings = {
    'alert-dialog.tsx': ('@radix-ui/react-alert-dialog', 'AlertDialog', 'AlertDialogPrimitive'),
    'aspect-ratio.tsx': ('@radix-ui/react-aspect-ratio', 'AspectRatio', 'AspectRatioPrimitive'),
    'avatar.tsx': ('@radix-ui/react-avatar', 'Avatar', 'AvatarPrimitive'),
    'checkbox.tsx': ('@radix-ui/react-checkbox', 'Checkbox', 'CheckboxPrimitive'),
    'collapsible.tsx': ('@radix-ui/react-collapsible', 'Collapsible', 'CollapsiblePrimitive'),
    'context-menu.tsx': ('@radix-ui/react-context-menu', 'ContextMenu', 'ContextMenuPrimitive'),
    'dialog.tsx': ('@radix-ui/react-dialog', 'Dialog', 'DialogPrimitive'),
    'dropdown-menu.tsx': ('@radix-ui/react-dropdown-menu', 'DropdownMenu', 'DropdownMenuPrimitive'),
    'hover-card.tsx': ('@radix-ui/react-hover-card', 'HoverCard', 'HoverCardPrimitive'),
    'label.tsx': ('@radix-ui/react-label', 'Label', 'LabelPrimitive'),
    'menubar.tsx': ('@radix-ui/react-menubar', 'Menubar', 'MenubarPrimitive'),
    'navigation-menu.tsx': ('@radix-ui/react-navigation-menu', 'NavigationMenu', 'NavigationMenuPrimitive'),
    'popover.tsx': ('@radix-ui/react-popover', 'Popover', 'PopoverPrimitive'),
    'progress.tsx': ('@radix-ui/react-progress', 'Progress', 'ProgressPrimitive'),
    'radio-group.tsx': ('@radix-ui/react-radio-group', 'RadioGroup', 'RadioGroupPrimitive'),
    'scroll-area.tsx': ('@radix-ui/react-scroll-area', 'ScrollArea', 'ScrollAreaPrimitive'),
    'select.tsx': ('@radix-ui/react-select', 'Select', 'SelectPrimitive'),
    'separator.tsx': ('@radix-ui/react-separator', 'Separator', 'SeparatorPrimitive'),
    'slider.tsx': ('@radix-ui/react-slider', 'Slider', 'SliderPrimitive'),
    'tabs.tsx': ('@radix-ui/react-tabs', 'Tabs', 'TabsPrimitive'),
    'toggle.tsx': ('@radix-ui/react-toggle', 'Toggle', 'TogglePrimitive'),
    'toggle-group.tsx': ('@radix-ui/react-toggle-group', 'ToggleGroup', 'ToggleGroupPrimitive'),
    'tooltip.tsx': ('@radix-ui/react-tooltip', 'Tooltip', 'TooltipPrimitive'),
}

special_mappings = {
    'sheet.tsx': ('@radix-ui/react-dialog', 'Dialog', 'SheetPrimitive'),
    'switch.tsx': ('@radix-ui/react-switch', 'Switch', 'SwitchPrimitives'),
    'toast.tsx': ('@radix-ui/react-toast', 'Toast', 'ToastPrimitives'),
}

dir_path = 'src/components/ui'

for filename, (old_pkg, new_export, alias) in mappings.items():
    path = os.path.join(dir_path, filename)
    if not os.path.exists(path): continue
    with open(path, 'r') as f:
        content = f.read()
    
    new_import = f'import {{ {new_export} as {alias} }} from "radix-ui"'
    old_import_re = rf'import \* as {alias} from "{old_pkg}"'
    content = re.sub(old_import_re, new_import, content)
    
    with open(path, 'w') as f:
        f.write(content)

for filename, (old_pkg, new_export, alias) in special_mappings.items():
    path = os.path.join(dir_path, filename)
    if not os.path.exists(path): continue
    with open(path, 'r') as f:
        content = f.read()
    
    new_import = f'import {{ {new_export} as {alias} }} from "radix-ui"'
    old_import_re = rf'import \* as {alias} from "{old_pkg}"'
    content = re.sub(old_import_re, new_import, content)
    
    with open(path, 'w') as f:
        f.write(content)

# Handle Slot files
slot_files = ['breadcrumb.tsx', 'button.tsx', 'sidebar.tsx']
for filename in slot_files:
    path = os.path.join(dir_path, filename)
    if not os.path.exists(path): continue
    with open(path, 'r') as f:
        content = f.read()
    
    if '@radix-ui/react-slot' in content:
        content = content.replace('import { Slot } from "@radix-ui/react-slot"', 'import { Slot as SlotPrimitive } from "radix-ui"')
        # Add const Slot = SlotPrimitive.Slot after the import
        lines = content.split('\n')
        new_lines = []
        for line in lines:
            new_lines.append(line)
            if 'import { Slot as SlotPrimitive } from "radix-ui"' in line:
                new_lines.append('const Slot = SlotPrimitive.Slot')
        content = '\n'.join(new_lines)
    
    with open(path, 'w') as f:
        f.write(content)

# Handle form.tsx (Label and Slot)
path = os.path.join(dir_path, 'form.tsx')
if os.path.exists(path):
    with open(path, 'r') as f:
        content = f.read()
    content = content.replace('import * as LabelPrimitive from "@radix-ui/react-label"', 'import { Label as LabelPrimitive, Slot as SlotPrimitive } from "radix-ui"')
    content = content.replace('import { Slot } from "@radix-ui/react-slot"', 'const Slot = SlotPrimitive.Slot')
    with open(path, 'w') as f:
        f.write(content)

# Handle command.tsx (DialogProps)
path = os.path.join(dir_path, 'command.tsx')
if os.path.exists(path):
    with open(path, 'r') as f:
        content = f.read()
    content = content.replace('import { type DialogProps } from "@radix-ui/react-dialog"', 'import { Dialog } from "radix-ui"')
    content = content.replace('interface CommandDialogProps extends DialogProps {}', 'interface CommandDialogProps extends React.ComponentPropsWithoutRef<typeof Dialog.Root> {}')
    with open(path, 'w') as f:
        f.write(content)
